import { Router } from 'express';
import User from '../models/User.model';
import Character, { CharacterClass } from '../models/Character.model';

const router = Router();

// Get base stats for Warrior
const getWarriorStats = () => {
  return { hp: 150, maxHp: 150, str: 15, agi: 8, int: 5, luk: 7, vit: 12 };
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
    const starterCharacter = new Character({
      walletAddress: normalizedAddress,
      characterName: 'Starter Warrior',
      characterClass: CharacterClass.WARRIOR,
      level: 1,
      exp: 0,
      ...starterStats,
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
    const { amount, tokenType } = req.body; // tokenType: 'AETH' or 'RON'
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

    // In production, verify blockchain transaction here
    if (tokenType === 'AETH') {
      user.tokens += amount;
    } else if (tokenType === 'RON') {
      user.ronTokens += amount;
    }
    
    await user.save();

    res.json({ 
      success: true, 
      tokens: user.tokens,
      ronTokens: user.ronTokens,
      message: `Deposited ${amount} ${tokenType}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/:walletAddress/wallet/withdraw - Withdraw tokens from game
router.post('/:walletAddress/wallet/withdraw', async (req, res) => {
  try {
    const { amount, tokenType } = req.body; // tokenType: 'AETH' or 'RON'
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

    let finalAmount = amount;
    let fee = 0;

    // AETH has 5% withdrawal fee, RON has no fee
    if (tokenType === 'AETH') {
      fee = amount * 0.05; // 5% fee
      finalAmount = amount; // User pays from their balance
      
      if (user.tokens < finalAmount) {
        return res.status(400).json({ success: false, error: 'Insufficient AETH tokens' });
      }

      user.tokens -= finalAmount;
      const amountAfterFee = finalAmount - fee;

      await user.save();

      res.json({ 
        success: true, 
        tokens: user.tokens,
        ronTokens: user.ronTokens,
        amountWithdrawn: amountAfterFee,
        fee: fee,
        message: `Withdrawn ${amountAfterFee.toFixed(2)} AETH (${fee.toFixed(2)} fee)`
      });
    } else if (tokenType === 'RON') {
      if (user.ronTokens < amount) {
        return res.status(400).json({ success: false, error: 'Insufficient RON tokens' });
      }

      user.ronTokens -= amount;
      await user.save();

      res.json({ 
        success: true, 
        tokens: user.tokens,
        ronTokens: user.ronTokens,
        amountWithdrawn: amount,
        fee: 0,
        message: `Withdrawn ${amount} RON (no fee)`
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
