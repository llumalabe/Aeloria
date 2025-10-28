import { Router } from 'express';
import User from '../models/User.model';

const router = Router();

// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { walletAddress, username } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      walletAddress: walletAddress.toLowerCase(),
      username,
    });

    await user.save();

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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
