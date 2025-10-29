// Example: How to integrate smart contracts with your frontend

import { ethers } from 'ethers';

// Contract ABIs (copy from artifacts after compilation)
const AETH_TOKEN_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
];

const WALLET_MANAGER_ABI = [
  "function depositAeth(uint256 amount) external",
  "function withdrawAeth(uint256 amount) external",
  "function depositRon() external payable",
  "function withdrawRon(uint256 amount) external",
  "function getBalances(address user) external view returns (uint256 aethBalance, uint256 ronBalance)",
  "function aethDeposits(address user) external view returns (uint256)",
  "function ronDeposits(address user) external view returns (uint256)",
];

// Contract addresses (update after deployment)
const AETH_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_AETH_TOKEN_ADDRESS;
const WALLET_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_WALLET_MANAGER_ADDRESS;

export class BlockchainWallet {
  private provider: ethers.BrowserProvider;
  private signer: ethers.Signer | null = null;
  private aethToken: ethers.Contract | null = null;
  private walletManager: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async connect() {
    if (!this.provider) throw new Error('No wallet provider found');
    
    this.signer = await this.provider.getSigner();
    
    this.aethToken = new ethers.Contract(
      AETH_TOKEN_ADDRESS!,
      AETH_TOKEN_ABI,
      this.signer
    );
    
    this.walletManager = new ethers.Contract(
      WALLET_MANAGER_ADDRESS!,
      WALLET_MANAGER_ABI,
      this.signer
    );
  }

  /**
   * Deposit AETH tokens to in-game wallet
   */
  async depositAeth(amount: string): Promise<string> {
    if (!this.aethToken || !this.walletManager) {
      throw new Error('Contracts not initialized');
    }

    const amountWei = ethers.parseEther(amount);

    // Step 1: Approve WalletManager to spend AETH
    console.log('Approving AETH...');
    const approveTx = await this.aethToken.approve(
      WALLET_MANAGER_ADDRESS,
      amountWei
    );
    await approveTx.wait();
    console.log('Approved!');

    // Step 2: Deposit
    console.log('Depositing AETH...');
    const depositTx = await this.walletManager.depositAeth(amountWei);
    const receipt = await depositTx.wait();
    console.log('Deposited!');

    return receipt.hash;
  }

  /**
   * Withdraw AETH tokens from in-game wallet (5% fee)
   */
  async withdrawAeth(amount: string): Promise<{ txHash: string; amountAfterFee: string }> {
    if (!this.walletManager) {
      throw new Error('Contracts not initialized');
    }

    const amountWei = ethers.parseEther(amount);
    
    // Calculate amount after fee (5%)
    const fee = (parseFloat(amount) * 0.05).toString();
    const amountAfterFee = (parseFloat(amount) - parseFloat(fee)).toString();

    console.log('Withdrawing AETH...');
    const tx = await this.walletManager.withdrawAeth(amountWei);
    const receipt = await tx.wait();
    console.log('Withdrawn!');

    return {
      txHash: receipt.hash,
      amountAfterFee,
    };
  }

  /**
   * Deposit RON (native currency) to in-game wallet
   */
  async depositRon(amount: string): Promise<string> {
    if (!this.walletManager) {
      throw new Error('Contracts not initialized');
    }

    const amountWei = ethers.parseEther(amount);

    console.log('Depositing RON...');
    const tx = await this.walletManager.depositRon({ value: amountWei });
    const receipt = await tx.wait();
    console.log('Deposited!');

    return receipt.hash;
  }

  /**
   * Withdraw RON from in-game wallet (no fee)
   */
  async withdrawRon(amount: string): Promise<string> {
    if (!this.walletManager) {
      throw new Error('Contracts not initialized');
    }

    const amountWei = ethers.parseEther(amount);

    console.log('Withdrawing RON...');
    const tx = await this.walletManager.withdrawRon(amountWei);
    const receipt = await tx.wait();
    console.log('Withdrawn!');

    return receipt.hash;
  }

  /**
   * Get user's on-chain deposit balances
   */
  async getBalances(userAddress: string): Promise<{ aethBalance: string; ronBalance: string }> {
    if (!this.walletManager) {
      throw new Error('Contracts not initialized');
    }

    const [aethWei, ronWei] = await this.walletManager.getBalances(userAddress);
    
    return {
      aethBalance: ethers.formatEther(aethWei),
      ronBalance: ethers.formatEther(ronWei),
    };
  }

  /**
   * Get user's AETH token balance in wallet
   */
  async getAethWalletBalance(userAddress: string): Promise<string> {
    if (!this.aethToken) {
      throw new Error('Contracts not initialized');
    }

    const balance = await this.aethToken.balanceOf(userAddress);
    return ethers.formatEther(balance);
  }
}

// Usage example:
export async function exampleUsage() {
  const wallet = new BlockchainWallet();
  await wallet.connect();

  const userAddress = '0x...';

  // Deposit 100 AETH
  const depositTxHash = await wallet.depositAeth('100');
  console.log('Deposit tx:', depositTxHash);

  // Withdraw 50 AETH (will receive 47.5 after 5% fee)
  const { txHash, amountAfterFee } = await wallet.withdrawAeth('50');
  console.log('Withdraw tx:', txHash);
  console.log('Received:', amountAfterFee, 'AETH');

  // Deposit 10 RON
  const ronDepositTx = await wallet.depositRon('10');
  console.log('RON deposit tx:', ronDepositTx);

  // Withdraw 5 RON (no fee)
  const ronWithdrawTx = await wallet.withdrawRon('5');
  console.log('RON withdraw tx:', ronWithdrawTx);

  // Check balances
  const balances = await wallet.getBalances(userAddress);
  console.log('On-chain AETH:', balances.aethBalance);
  console.log('On-chain RON:', balances.ronBalance);
}
