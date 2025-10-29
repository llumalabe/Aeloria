// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WalletManager
 * @dev Manages deposits and withdrawals of AETH tokens and RON (native currency)
 */
contract WalletManager is ReentrancyGuard, Ownable {
    IERC20 public aethToken;
    
    // Withdrawal fee: 5% for AETH (500 = 5.00%)
    uint256 public constant AETH_WITHDRAWAL_FEE = 500;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Track deposits per user per token
    mapping(address => uint256) public aethDeposits;
    mapping(address => uint256) public ronDeposits;
    
    // Fee collection
    uint256 public collectedAethFees;
    uint256 public collectedRonFees;
    
    event AethDeposited(address indexed user, uint256 amount);
    event AethWithdrawn(address indexed user, uint256 amount, uint256 fee);
    event RonDeposited(address indexed user, uint256 amount);
    event RonWithdrawn(address indexed user, uint256 amount);
    event FeesWithdrawn(address indexed owner, uint256 aethFees, uint256 ronFees);

    constructor(address _aethToken) Ownable(msg.sender) {
        require(_aethToken != address(0), "Invalid token address");
        aethToken = IERC20(_aethToken);
    }

    /**
     * @dev Deposit AETH tokens to in-game wallet
     * @param amount Amount of AETH to deposit
     */
    function depositAeth(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(aethToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        aethDeposits[msg.sender] += amount;
        emit AethDeposited(msg.sender, amount);
    }

    /**
     * @dev Withdraw AETH tokens from in-game wallet (5% fee)
     * @param amount Amount of AETH to withdraw (before fee)
     */
    function withdrawAeth(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(aethDeposits[msg.sender] >= amount, "Insufficient balance");
        
        // Calculate fee (5%)
        uint256 fee = (amount * AETH_WITHDRAWAL_FEE) / FEE_DENOMINATOR;
        uint256 amountAfterFee = amount - fee;
        
        // Update balances
        aethDeposits[msg.sender] -= amount;
        collectedAethFees += fee;
        
        // Transfer tokens to user (amount minus fee)
        require(aethToken.transfer(msg.sender, amountAfterFee), "Transfer failed");
        
        emit AethWithdrawn(msg.sender, amountAfterFee, fee);
    }

    /**
     * @dev Deposit RON (native currency) to in-game wallet
     */
    function depositRon() external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        
        ronDeposits[msg.sender] += msg.value;
        emit RonDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw RON from in-game wallet (no fee)
     * @param amount Amount of RON to withdraw
     */
    function withdrawRon(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(ronDeposits[msg.sender] >= amount, "Insufficient balance");
        
        ronDeposits[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RonWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Get user's deposit balances
     * @param user User address
     * @return aethBalance AETH deposit balance
     * @return ronBalance RON deposit balance
     */
    function getBalances(address user) external view returns (uint256 aethBalance, uint256 ronBalance) {
        return (aethDeposits[user], ronDeposits[user]);
    }

    /**
     * @dev Withdraw collected fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 aethFees = collectedAethFees;
        uint256 ronFees = collectedRonFees;
        
        collectedAethFees = 0;
        collectedRonFees = 0;
        
        if (aethFees > 0) {
            require(aethToken.transfer(owner(), aethFees), "AETH transfer failed");
        }
        
        if (ronFees > 0) {
            (bool success, ) = owner().call{value: ronFees}("");
            require(success, "RON transfer failed");
        }
        
        emit FeesWithdrawn(owner(), aethFees, ronFees);
    }

    /**
     * @dev Emergency withdraw all tokens (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 aethBalance = aethToken.balanceOf(address(this));
        uint256 ronBalance = address(this).balance;
        
        if (aethBalance > 0) {
            require(aethToken.transfer(owner(), aethBalance), "AETH transfer failed");
        }
        
        if (ronBalance > 0) {
            (bool success, ) = owner().call{value: ronBalance}("");
            require(success, "RON transfer failed");
        }
    }

    // Receive RON
    receive() external payable {
        ronDeposits[msg.sender] += msg.value;
        emit RonDeposited(msg.sender, msg.value);
    }
}
