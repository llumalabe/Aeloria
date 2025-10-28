import { Router } from 'express';
import User from '../models/User.model';

const router = Router();

// POST /api/gacha/summon - Perform gacha summon
router.post('/summon', async (req, res) => {
  try {
    const { walletAddress, summonType } = req.body;

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Summon costs
    const costs = {
      basic: { gold: 1000, premium: 0, tokens: 0 },
      premium: { gold: 0, premium: 100, tokens: 0 },
      legendary: { gold: 0, premium: 0, tokens: 10 },
    };

    const cost = costs[summonType as keyof typeof costs];
    if (!cost) {
      return res.status(400).json({ success: false, error: 'Invalid summon type' });
    }

    // Check if user has enough currency
    if (user.gold < cost.gold || user.premium < cost.premium || user.tokens < cost.tokens) {
      return res.status(400).json({ success: false, error: 'Insufficient currency' });
    }

    // Deduct cost
    user.gold -= cost.gold;
    user.premium -= cost.premium;
    user.tokens -= cost.tokens;
    await user.save();

    // Determine rarity based on summon type
    const rarityRolls = {
      basic: [
        { rarity: 'Common', probability: 0.60 },
        { rarity: 'Uncommon', probability: 0.30 },
        { rarity: 'Rare', probability: 0.10 },
      ],
      premium: [
        { rarity: 'Uncommon', probability: 0.40 },
        { rarity: 'Rare', probability: 0.40 },
        { rarity: 'Epic', probability: 0.15 },
        { rarity: 'Legendary', probability: 0.05 },
      ],
      legendary: [
        { rarity: 'Epic', probability: 0.50 },
        { rarity: 'Legendary', probability: 0.40 },
        { rarity: 'Mythic', probability: 0.10 },
      ],
    };

    const rolls = rarityRolls[summonType as keyof typeof rarityRolls];
    const random = Math.random();
    let cumulativeProbability = 0;
    let result = rolls[0];

    for (const roll of rolls) {
      cumulativeProbability += roll.probability;
      if (random <= cumulativeProbability) {
        result = roll;
        break;
      }
    }

    res.json({ 
      success: true, 
      result: {
        rarity: result.rarity,
        message: `You summoned a ${result.rarity} item!`,
      },
      user 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
