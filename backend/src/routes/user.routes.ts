import { Router, Request, Response } from 'express';
import User from '../models/User.model';
import Character, { CharacterClass, Rarity } from '../models/Character.model';

const router = Router();

// Get base stats for Warrior
const getWarriorStats = () => {
  return { hp: 150, maxHp: 150, str: 15, agi: 8, int: 5, luk: 7, vit: 12 };
};

// Get Warrior passive skills
const getWarriorPassiveSkills = () => {
  return [
    { name: 'Iron Will', description: 'Increased defense and HP regeneration', effect: '+15% VIT, +2% HP Regen per turn' },
    { name: 'Battle Rage', description: 'Deal more damage when HP is low', effect: '+20% STR when HP < 30%' },
  ];
};

// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);
    
    const { walletAddress, username } = req.body;

    // Validate walletAddress
    if (!walletAddress) {
      console.error('❌ Missing walletAddress');
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address is required' 
      });
    }

    const normalizedAddress = walletAddress.toLowerCase();
    console.log('🔍 Normalized address:', normalizedAddress);

    // Check if user exists
    const existingUser = await User.findOne({ walletAddress: normalizedAddress });
    if (existingUser) {
      console.log('⚠️ User already exists:', normalizedAddress);
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Generate default username if not provided
    const finalUsername = username || `Player_${normalizedAddress.slice(2, 8)}`;
    console.log('👤 Username to use:', finalUsername);

    // Generate referral code
    const generatedReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create new user
    const user = new User({
      walletAddress: normalizedAddress,
      username: finalUsername,
      referralCode: generatedReferralCode,
    });

    console.log('💾 Saving user to database...');
    await user.save();
    console.log('✅ User saved successfully');

    // Auto-create starter Warrior character
    const starterStats = getWarriorStats();
    const starterPassiveSkills = getWarriorPassiveSkills();
    
    const starterCharacter = new Character({
      walletAddress: normalizedAddress,
      characterName: 'Starter Warrior',
      characterClass: CharacterClass.WARRIOR,
      rarity: Rarity.COMMON,
      level: 1,
      exp: 0,
      expRequired: 100,
      ...starterStats,
      passiveSkills: starterPassiveSkills,
      equipment: {}, // Empty equipment slots
      isNFT: false,
      isBoundToAccount: true,
      tokenId: null,
    });

    console.log('⚔️ Creating starter character...');
    await starterCharacter.save();
    console.log('✅ Starter character created');

    res.json({ 
      success: true, 
      user,
      starterCharacter,
      message: 'User registered with starter character'
    });
  } catch (error: any) {
    console.error('💥 Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    
    // Detailed error response
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Unknown error occurred',
      errorName: error.name,
      errorCode: error.code,
      details: process.env.NODE_ENV === 'production' ? undefined : {
        stack: error.stack,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      }
    });
  }
});

// GET /api/users/:walletAddress - Get user profile
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/:walletAddress/login - Daily login
router.post('/:walletAddress/login', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const today = new Date();
    const lastLogin = new Date(user.lastLoginDate);
    const daysSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    let rewards = { gold: 100, premium: 0, tokens: 0 };

    if (daysSinceLastLogin === 1) {
      // Consecutive login
      user.loginStreak++;
      
      // Bonus rewards for streak
      if (user.loginStreak % 7 === 0) {
        rewards.premium = 50;
        rewards.tokens = 10;
      }
    } else if (daysSinceLastLogin > 1) {
      // Reset streak
      user.loginStreak = 1;
    }

    user.lastLoginDate = today;
    user.gold += rewards.gold;
    user.premium += rewards.premium;
    user.tokens += rewards.tokens;

    await user.save();

    res.json({ success: true, rewards, loginStreak: user.loginStreak });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/:walletAddress/currency - Update user currency
router.post('/:walletAddress/currency', async (req, res) => {
  try {
    const { gold, premium, tokens } = req.body;
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (gold !== undefined) user.gold += gold;
    if (premium !== undefined) user.premium += premium;
    if (tokens !== undefined) user.tokens += tokens;

    await user.save();

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/:walletAddress/energy - Get and auto-reset energy
router.get('/:walletAddress/energy', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if energy needs reset (9:00 AM Thailand time = 2:00 AM UTC)
    const now = new Date();
    const thailandTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
    const lastReset = new Date(user.lastEnergyReset.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
    
    const currentHour = thailandTime.getHours();
    const lastResetHour = lastReset.getHours();
    const isSameDay = thailandTime.toDateString() === lastReset.toDateString();
    
    // Reset if it's past 9:00 AM and hasn't been reset today
    if (currentHour >= 9 && (!isSameDay || lastResetHour < 9)) {
      user.energy = user.maxEnergy;
      user.lastEnergyReset = now;
      await user.save();
    }

    res.json({ 
      success: true, 
      energy: user.energy,
      maxEnergy: user.maxEnergy,
      lastReset: user.lastEnergyReset
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/:walletAddress/energy/use - Use energy
router.post('/:walletAddress/energy/use', async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.energy < amount) {
      return res.status(400).json({ success: false, error: 'Not enough energy' });
    }

    user.energy -= amount;
    await user.save();

    res.json({ success: true, energy: user.energy, maxEnergy: user.maxEnergy });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/:walletAddress/wallet/deposit - Deposit tokens to game
router.post('/:walletAddress/wallet/deposit', async (req, res) => {
  try {
    const { amount, tokenType, txHash } = req.body; // tokenType: 'AETH' or 'RON'
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    if (!tokenType || !['AETH', 'RON'].includes(tokenType)) {
      return res.status(400).json({ success: false, error: 'Invalid token type' });
    }

    if (!txHash) {
      return res.status(400).json({ success: false, error: 'Transaction hash required' });
    }

    // IMPORTANT: Do NOT modify user.tokens or user.ronTokens
    // Deposits go to WalletManager contract, not in-game tokens
    // Smart contract already holds the tokens
    // We just need to log the transaction for history

    // Save transaction history
    user.transactions.push({
      txHash,
      type: 'deposit',
      tokenType,
      amount: amount.toString(),
      fee: '0',
      status: 'confirmed',
      timestamp: new Date(),
      verified: true
    });

    await user.save();

    res.json({
      success: true,
      tokens: user.tokens,
      ronTokens: user.ronTokens,
      message: `Deposited ${amount} ${tokenType} to WalletManager`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});// POST /api/users/:walletAddress/wallet/withdraw - Withdraw tokens from game
router.post('/:walletAddress/wallet/withdraw', async (req, res) => {
  try {
    const { amount, tokenType, txHash } = req.body; // tokenType: 'AETH' or 'RON'
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    if (!tokenType || !['AETH', 'RON'].includes(tokenType)) {
      return res.status(400).json({ success: false, error: 'Invalid token type' });
    }

    if (!txHash) {
      return res.status(400).json({ success: false, error: 'Transaction hash required' });
    }

    // Calculate fees (AETH has 5% withdrawal fee, RON has no fee)
    let fee = 0;
    let amountAfterFee = amount;
    
    if (tokenType === 'AETH') {
      fee = amount * 0.05; // 5% fee
      amountAfterFee = amount - fee;
    }

    // IMPORTANT: Do NOT deduct user.tokens or user.ronTokens
    // The withdrawal is from WalletManager deposits, not in-game tokens
    // Smart contract already transferred tokens to user's wallet
    // We just need to log the transaction for history

    // Save transaction history
    user.transactions.push({
      txHash,
      type: 'withdraw',
      tokenType,
      amount: amountAfterFee.toString(),
      fee: fee.toString(),
      status: 'confirmed',
      timestamp: new Date(),
      verified: true
    });

    await user.save();

    res.json({
      success: true,
      tokens: user.tokens,
      ronTokens: user.ronTokens,
      amountWithdrawn: amountAfterFee,
      fee: fee,
      message: tokenType === 'AETH' 
        ? `Withdrawn ${amountAfterFee.toFixed(4)} AETH (${fee.toFixed(4)} AETH fee)` 
        : `Withdrawn ${amount} RON (no fee)`
    });
  } catch (error: any) {
    console.error('Withdraw error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Convert in-game AETH to withdrawable (deduct from DB, will be deposited to contract)
router.post('/:address/wallet/convert', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    const user = await User.findOne({ walletAddress: address.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if user has enough in-game AETH
    if (user.tokens < amount) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient in-game AETH. You have ${user.tokens}, need ${amount}` 
      });
    }

    // Deduct from in-game balance
    user.tokens -= amount;

    // Record transaction
    user.transactions.push({
      txHash: `convert-${Date.now()}`,
      type: 'convert',
      tokenType: 'AETH',
      amount: amount.toString(),
      fee: '0',
      status: 'confirmed',
      timestamp: new Date(),
      verified: true
    });

    await user.save();

    res.json({
      success: true,
      tokens: user.tokens,
      convertedAmount: amount,
      message: `Converted ${amount} in-game AETH to withdrawable`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// GET /api/users/:address/transactions - Get transaction history
router.get('/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const user = await User.findOne({
      walletAddress: address.toLowerCase()
    });

    if (!user) {
      return res.json({ success: true, transactions: [] }); // Return empty array instead of 404
    }

    // Get transactions from user model
    const transactions = user.transactions || [];
    
    // Sort by timestamp descending (newest first)
    const sortedTx = transactions
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    res.json({ success: true, transactions: sortedTx });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
});

// POST /api/users/:walletAddress/claim-daily - Claim daily reward
router.post('/:walletAddress/claim-daily', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Check if already claimed today
    const lastClaim = user.lastDailyReward;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (lastClaim) {
      const lastClaimDate = new Date(
        lastClaim.getFullYear(), 
        lastClaim.getMonth(), 
        lastClaim.getDate()
      );
      
      if (lastClaimDate.getTime() === today.getTime()) {
        return res.status(400).json({ 
          success: false, 
          error: 'Daily reward already claimed today' 
        });
      }
    }

    // Daily reward amounts
    const dailyRewards = {
      gold: 100,
      premium: 10,
      exp: 50
    };

    // Update user
    user.gold += dailyRewards.gold;
    user.premium += dailyRewards.premium;
    user.exp += dailyRewards.exp;
    user.lastDailyReward = now;

    // Add transaction record
    if (!user.transactions) {
      user.transactions = [];
    }
    
    user.transactions.push({
      type: 'Daily Reward',
      amount: dailyRewards.gold,
      timestamp: now,
      status: 'Completed',
    });

    await user.save();

    res.json({ 
      success: true, 
      rewards: dailyRewards,
      user: {
        gold: user.gold,
        premium: user.premium,
        exp: user.exp,
        level: user.level
      }
    });
  } catch (error: any) {
    console.error('Error claiming daily reward:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to claim daily reward' 
    });
  }
});

export default router;






