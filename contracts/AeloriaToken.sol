// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AeloriaToken
 * @dev ERC20 Token for Aeloria Game Economy (Premium/Cash Token)
 */
contract AeloriaToken is ERC20, ERC20Burnable, Ownable {
    
    // Token distribution addresses
    address public rewardPool;
    address public treasuryWallet;
    address public teamWallet;

    // Anti-bot measures
    mapping(address => uint256) public lastTransactionTime;
    uint256 public transactionCooldown = 1 seconds;
    mapping(address => bool) public whitelist;

    // Daily transaction limits
    mapping(address => uint256) public dailyTransactionCount;
    mapping(address => uint256) public lastTransactionDate;
    uint256 public maxDailyTransactions = 100;

    // Events
    event RewardDistributed(address indexed to, uint256 amount);
    event AirdropSent(address indexed to, uint256 amount);
    event WhitelistUpdated(address indexed account, bool status);

    constructor(
        address _rewardPool,
        address _treasuryWallet,
        address _teamWallet
    ) ERC20("Aeloria Token", "AETH") Ownable(msg.sender) {
        rewardPool = _rewardPool;
        treasuryWallet = _treasuryWallet;
        teamWallet = _teamWallet;

        // Initial distribution (1 billion tokens)
        uint256 totalSupply = 1_000_000_000 * 10**decimals();
        
        _mint(rewardPool, totalSupply * 40 / 100);      // 40% for rewards
        _mint(treasuryWallet, totalSupply * 30 / 100);  // 30% for treasury
        _mint(teamWallet, totalSupply * 20 / 100);      // 20% for team
        _mint(msg.sender, totalSupply * 10 / 100);      // 10% for initial liquidity

        // Whitelist key addresses
        whitelist[_rewardPool] = true;
        whitelist[_treasuryWallet] = true;
        whitelist[_teamWallet] = true;
        whitelist[msg.sender] = true;
    }

    /**
     * @dev Anti-bot transfer override
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        _checkTransferRestrictions(msg.sender);
        return super.transfer(to, amount);
    }

    /**
     * @dev Anti-bot transferFrom override
     */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        _checkTransferRestrictions(from);
        return super.transferFrom(from, to, amount);
    }

    /**
     * @dev Check transfer restrictions (anti-bot)
     */
    function _checkTransferRestrictions(address from) private {
        if (!whitelist[from]) {
            // Cooldown check
            require(
                block.timestamp >= lastTransactionTime[from] + transactionCooldown,
                "Transaction cooldown active"
            );

            // Daily transaction limit
            if (block.timestamp > lastTransactionDate[from] + 1 days) {
                dailyTransactionCount[from] = 0;
                lastTransactionDate[from] = block.timestamp;
            }

            require(
                dailyTransactionCount[from] < maxDailyTransactions,
                "Daily transaction limit reached"
            );

            dailyTransactionCount[from]++;
            lastTransactionTime[from] = block.timestamp;
        }
    }

    /**
     * @dev Distribute rewards to player
     */
    function distributeReward(address to, uint256 amount) public onlyOwner {
        require(balanceOf(rewardPool) >= amount, "Insufficient reward pool balance");
        _transfer(rewardPool, to, amount);
        emit RewardDistributed(to, amount);
    }

    /**
     * @dev Batch airdrop to multiple addresses
     */
    function batchAirdrop(address[] memory recipients, uint256[] memory amounts) public onlyOwner {
        require(recipients.length == amounts.length, "Array length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(balanceOf(rewardPool) >= amounts[i], "Insufficient reward pool balance");
            _transfer(rewardPool, recipients[i], amounts[i]);
            emit AirdropSent(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Update whitelist status
     */
    function updateWhitelist(address account, bool status) public onlyOwner {
        whitelist[account] = status;
        emit WhitelistUpdated(account, status);
    }

    /**
     * @dev Update transaction cooldown
     */
    function setTransactionCooldown(uint256 newCooldown) public onlyOwner {
        transactionCooldown = newCooldown;
    }

    /**
     * @dev Update max daily transactions
     */
    function setMaxDailyTransactions(uint256 newLimit) public onlyOwner {
        maxDailyTransactions = newLimit;
    }

    /**
     * @dev Mint new tokens (for game rewards)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Update reward pool address
     */
    function setRewardPool(address newRewardPool) public onlyOwner {
        rewardPool = newRewardPool;
        whitelist[newRewardPool] = true;
    }

    /**
     * @dev Update treasury wallet
     */
    function setTreasuryWallet(address newTreasury) public onlyOwner {
        treasuryWallet = newTreasury;
        whitelist[newTreasury] = true;
    }
}
