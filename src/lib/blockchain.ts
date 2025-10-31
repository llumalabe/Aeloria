import { ethers } from 'ethers';
import { CONTRACTS, RONIN_TESTNET } from '@/config/contracts';
import AeloriaTokenABI from './abis/AeloriaToken.json';
import WalletManagerABI from './abis/WalletManager.json';

// Type definitions
export interface DepositResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface WithdrawResult {
  success: boolean;
  txHash?: string;
  amountReceived?: string;
  fee?: string;
  error?: string;
}

export interface WalletBalances {
  aethBalance: string;
  ronBalance: string;
}

/**
 * Detect if user is on mobile
 */
function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Open Ronin Wallet app on mobile via deep link
 */
function openRoninWalletApp(url?: string): void {
  const deepLinkUrl = url || 'roninwallet://';
  
  // Try to open deep link
  window.location.href = deepLinkUrl;
  
  // Fallback: Open app store if wallet not installed
  setTimeout(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const storeUrl = isIOS
      ? 'https://apps.apple.com/app/ronin-wallet/id1592675001'
      : 'https://play.google.com/store/apps/details?id=com.skymavis.genesis';
    
    window.open(storeUrl, '_blank');
  }, 2000);
}

/**
 * Blockchain Wallet Manager for Aeloria Game
 * Supports both Desktop (Extension) and Mobile (Deep Link + WalletConnect)
 */
export class BlockchainWallet {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private aethContract: ethers.Contract | null = null;
  private walletContract: ethers.Contract | null = null;
  private isMobileDevice: boolean = false;

  constructor() {
    this.isMobileDevice = isMobile();
  }

  /**
   * Initialize wallet connection
   * Automatically detects Desktop vs Mobile
   */
  async connect(): Promise<boolean> {
    try {
      // Mobile: Use WalletConnect or Deep Link
      if (this.isMobileDevice) {
        return await this.connectMobile();
      }
      
      // Desktop: Use Browser Extension
      return await this.connectDesktop();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }

  /**
   * Connect via Browser Extension (Desktop)
   */
  private async connectDesktop(): Promise<boolean> {
    // Check if wallet extension exists (Ronin Wallet or Ronin Waypoint)
    const roninProvider = (window as any).ronin?.provider;
    const ethereumProvider = (window as any).ethereum;
    
    if (typeof window === 'undefined' || (!roninProvider && !ethereumProvider)) {
      alert('❌ Ronin Wallet extension not found!\n\n' +
            '📥 Please install Ronin Wallet:\n' +
            'Chrome: https://chrome.google.com/webstore/detail/ronin-wallet');
      return false;
    }

    // Use Ronin provider if available, otherwise fallback to ethereum
    const provider = roninProvider || ethereumProvider;
    this.provider = new ethers.BrowserProvider(provider);

    // Request account access
    await this.provider.send('eth_requestAccounts', []);

    // Get signer
    this.signer = await this.provider.getSigner();

    // Check network
    await this.ensureCorrectNetwork();

    // Initialize contracts
    await this.initializeContracts();

    console.log('✅ Desktop wallet connected');
    return true;
  }

  /**
   * Connect via Deep Link or WalletConnect (Mobile)
   */
  private async connectMobile(): Promise<boolean> {
    // Method 1: Try existing provider (if Ronin app opened the browser)
    if ((window as any).ethereum) {
      console.log('✅ Ronin Wallet provider detected on mobile');
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      
      try {
        await this.provider.send('eth_requestAccounts', []);
        this.signer = await this.provider.getSigner();
        await this.ensureCorrectNetwork();
        await this.initializeContracts();
        return true;
      } catch (error) {
        console.error('Provider connection failed:', error);
      }
    }

    // Method 2: Deep Link to Ronin Wallet app
    console.log('📱 Opening Ronin Wallet app...');
    
    // Show instruction to user
    const shouldContinue = confirm(
      '📱 Mobile Wallet Connection\n\n' +
      '1. You will be redirected to Ronin Wallet app\n' +
      '2. Approve the connection request\n' +
      '3. Return to this page\n\n' +
      'Click OK to continue'
    );

    if (!shouldContinue) {
      return false;
    }

    // Construct deep link with callback
    const callbackUrl = encodeURIComponent(window.location.href);
    const deepLink = `roninwallet://wc?uri=${callbackUrl}`;
    
    // Open Ronin Wallet app
    openRoninWalletApp(deepLink);

    // Wait for user to return
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds

      const checkConnection = setInterval(async () => {
        attempts++;

        // Check if provider is now available
        if ((window as any).ethereum) {
          clearInterval(checkConnection);
          
          try {
            this.provider = new ethers.BrowserProvider((window as any).ethereum);
            await this.provider.send('eth_requestAccounts', []);
            this.signer = await this.provider.getSigner();
            await this.ensureCorrectNetwork();
            await this.initializeContracts();
            resolve(true);
          } catch (error) {
            console.error('Connection error:', error);
            resolve(false);
          }
        }

        // Timeout after 30 seconds
        if (attempts >= maxAttempts) {
          clearInterval(checkConnection);
          alert('⏱️ Connection timeout\n\nPlease try again or install Ronin Wallet app');
          resolve(false);
        }
      }, 1000);
    });
  }

  /**
   * Ensure connected to correct network
   */
  private async ensureCorrectNetwork(): Promise<void> {
    if (!this.provider) return;

    const network = await this.provider.getNetwork();
    const chainId = Number(network.chainId);

    if (chainId !== RONIN_TESTNET.chainId) {
      console.log('Wrong network, switching to Ronin Saigon...');

      try {
        await this.provider.send('wallet_switchEthereumChain', [
          { chainId: RONIN_TESTNET.chainIdHex },
        ]);
      } catch (switchError: any) {
        // Network not added, add it
        if (switchError.code === 4902) {
          await this.provider.send('wallet_addEthereumChain', [
            {
              chainId: RONIN_TESTNET.chainIdHex,
              chainName: RONIN_TESTNET.name,
              rpcUrls: [RONIN_TESTNET.rpcUrl],
              blockExplorerUrls: [RONIN_TESTNET.blockExplorer],
              nativeCurrency: {
                name: 'RON',
                symbol: 'RON',
                decimals: 18,
              },
            },
          ]);
        } else {
          throw switchError;
        }
      }
    }
  }

  /**
   * Initialize contract instances
   */
  private async initializeContracts(): Promise<void> {
    if (!this.signer) return;

    this.aethContract = new ethers.Contract(
      CONTRACTS.AETH_TOKEN,
      AeloriaTokenABI.abi,
      this.signer
    );

    this.walletContract = new ethers.Contract(
      CONTRACTS.WALLET_MANAGER,
      WalletManagerABI.abi,
      this.signer
    );
  }

  /**
   * Get connected wallet address
   */
  async getAddress(): Promise<string | null> {
    try {
      if (!this.signer) return null;
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Failed to get address:', error);
      return null;
    }
  }

  /**
   * Get user's wallet balances (AETH and RON in contract)
   */
  async getBalances(address: string): Promise<WalletBalances | null> {
    try {
      if (!this.walletContract) {
        throw new Error('Wallet not connected');
      }

      const balances = await this.walletContract.getBalances(address);

      return {
        aethBalance: ethers.formatEther(balances.aethBalance),
        ronBalance: ethers.formatEther(balances.ronBalance),
      };
    } catch (error) {
      console.error('Failed to get balances:', error);
      return null;
    }
  }

  /**
   * Get user's AETH token balance in wallet (not in contract)
   */
  async getAethTokenBalance(address: string): Promise<string | null> {
    try {
      if (!this.aethContract) {
        throw new Error('Wallet not connected');
      }

      const balance = await this.aethContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get AETH balance:', error);
      return null;
    }
  }

  /**
   * Get user's RON balance in wallet
   */
  async getRonBalance(address: string): Promise<string | null> {
    try {
      if (!this.provider) {
        throw new Error('Wallet not connected');
      }

      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get RON balance:', error);
      return null;
    }
  }

  /**
   * Deposit AETH tokens to game contract
   * Requires 2 transactions: approve + deposit
   */
  async depositAeth(amount: string): Promise<DepositResult> {
    try {
      if (!this.aethContract || !this.walletContract) {
        throw new Error('Wallet not connected');
      }

      const amountWei = ethers.parseEther(amount);

      // Step 1: Approve WalletManager to spend AETH
      console.log('Approving AETH spend...');
      const approveTx = await this.aethContract.approve(
        CONTRACTS.WALLET_MANAGER,
        amountWei
      );
      await approveTx.wait();
      console.log('Approval confirmed:', approveTx.hash);

      // Step 2: Deposit AETH to WalletManager
      console.log('Depositing AETH...');
      const depositTx = await this.walletContract.depositAeth(amountWei);
      const receipt = await depositTx.wait();
      console.log('Deposit confirmed:', depositTx.hash);

      return {
        success: true,
        txHash: depositTx.hash,
      };
    } catch (error: any) {
      console.error('AETH deposit failed:', error);
      return {
        success: false,
        error: error.message || 'Transaction failed',
      };
    }
  }

  /**
   * Withdraw AETH tokens from game contract
   * 5% fee will be deducted
   */
  async withdrawAeth(amount: string): Promise<WithdrawResult> {
    try {
      if (!this.walletContract) {
        throw new Error('Wallet not connected');
      }

      const amountWei = ethers.parseEther(amount);

      // Calculate fee (5%)
      const fee = (Number(amount) * 0.05).toString();
      const amountReceived = (Number(amount) * 0.95).toString();

      console.log('Withdrawing AETH...');
      const withdrawTx = await this.walletContract.withdrawAeth(amountWei);
      const receipt = await withdrawTx.wait();
      console.log('Withdrawal confirmed:', withdrawTx.hash);

      return {
        success: true,
        txHash: withdrawTx.hash,
        amountReceived,
        fee,
      };
    } catch (error: any) {
      console.error('AETH withdrawal failed:', error);
      return {
        success: false,
        error: error.message || 'Transaction failed',
      };
    }
  }

  /**
   * Deposit RON to game contract
   */
  async depositRon(amount: string): Promise<DepositResult> {
    try {
      if (!this.walletContract) {
        throw new Error('Wallet not connected');
      }

      const amountWei = ethers.parseEther(amount);

      console.log('Depositing RON...');
      const depositTx = await this.walletContract.depositRon({
        value: amountWei,
      });
      const receipt = await depositTx.wait();
      console.log('Deposit confirmed:', depositTx.hash);

      return {
        success: true,
        txHash: depositTx.hash,
      };
    } catch (error: any) {
      console.error('RON deposit failed:', error);
      return {
        success: false,
        error: error.message || 'Transaction failed',
      };
    }
  }

  /**
   * Withdraw RON from game contract
   * No fees for RON withdrawals
   */
  async withdrawRon(amount: string): Promise<WithdrawResult> {
    try {
      if (!this.walletContract) {
        throw new Error('Wallet not connected');
      }

      const amountWei = ethers.parseEther(amount);

      console.log('Withdrawing RON...');
      const withdrawTx = await this.walletContract.withdrawRon(amountWei);
      const receipt = await withdrawTx.wait();
      console.log('Withdrawal confirmed:', withdrawTx.hash);

      return {
        success: true,
        txHash: withdrawTx.hash,
        amountReceived: amount,
        fee: '0',
      };
    } catch (error: any) {
      console.error('RON withdrawal failed:', error);
      return {
        success: false,
        error: error.message || 'Transaction failed',
      };
    }
  }

  /**
   * Listen to wallet account changes
   */
  onAccountChange(callback: (accounts: string[]) => void): void {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', callback);
    }
  }

  /**
   * Listen to network changes
   */
  onNetworkChange(callback: (chainId: string) => void): void {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('chainChanged', callback);
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.aethContract = null;
    this.walletContract = null;
  }

  /**
   * Check if running on mobile
   */
  isMobile(): boolean {
    return this.isMobileDevice;
  }
}

// Export singleton instance
export const blockchainWallet = new BlockchainWallet();
