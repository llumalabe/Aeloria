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

    // Create new user
    const user = new User({
      walletAddress: normalizedAddress,
      username: finalUsername,
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

export default router;
