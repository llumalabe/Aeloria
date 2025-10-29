import { Router } from 'express';
import User from '../models/User.model';
import Character, { CharacterClass } from '../models/Character.model';

const router = Router();

// Character class names
const CLASS_NAMES = ['Warrior', 'Mage', 'Archer', 'Rogue', 'Cleric', 'Paladin'];

// Get base stats for each class
const getBaseStats = (characterClass: CharacterClass) => {
  const baseStats = {
    [CharacterClass.WARRIOR]: { hp: 150, maxHp: 150, str: 15, agi: 8, int: 5, luk: 7, vit: 12 },
    [CharacterClass.MAGE]: { hp: 80, maxHp: 80, str: 5, agi: 7, int: 18, luk: 10, vit: 6 },
    [CharacterClass.ARCHER]: { hp: 100, maxHp: 100, str: 8, agi: 16, int: 7, luk: 12, vit: 8 },
    [CharacterClass.ROGUE]: { hp: 90, maxHp: 90, str: 10, agi: 17, int: 6, luk: 15, vit: 7 },
    [CharacterClass.CLERIC]: { hp: 110, maxHp: 110, str: 6, agi: 8, int: 15, luk: 9, vit: 11 },
    [CharacterClass.PALADIN]: { hp: 140, maxHp: 140, str: 12, agi: 9, int: 10, luk: 8, vit: 13 },
  };
  return baseStats[characterClass];
};

// POST /api/gacha/summon - Perform gacha summon for character
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

    // Roll for character class (random)
    const characterClass = Math.floor(Math.random() * 6) as CharacterClass; // 0-5
    const className = CLASS_NAMES[characterClass];

    // Determine rarity based on summon type (affects starting stats bonus)
    const rarityRolls = {
      basic: [
        { rarity: 'Common', statBonus: 0, probability: 0.60 },
        { rarity: 'Uncommon', statBonus: 2, probability: 0.30 },
        { rarity: 'Rare', statBonus: 5, probability: 0.10 },
      ],
      premium: [
        { rarity: 'Uncommon', statBonus: 2, probability: 0.40 },
        { rarity: 'Rare', statBonus: 5, probability: 0.40 },
        { rarity: 'Epic', statBonus: 10, probability: 0.15 },
        { rarity: 'Legendary', statBonus: 20, probability: 0.05 },
      ],
      legendary: [
        { rarity: 'Epic', statBonus: 10, probability: 0.50 },
        { rarity: 'Legendary', statBonus: 20, probability: 0.40 },
        { rarity: 'Mythic', statBonus: 30, probability: 0.10 },
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

    // Get base stats and apply rarity bonus
    const baseStats = getBaseStats(characterClass);
    const bonusedStats = {
      hp: baseStats.hp + (result.statBonus * 2),
      maxHp: baseStats.maxHp + (result.statBonus * 2),
      str: baseStats.str + result.statBonus,
      agi: baseStats.agi + result.statBonus,
      int: baseStats.int + result.statBonus,
      luk: baseStats.luk + result.statBonus,
      vit: baseStats.vit + result.statBonus,
    };

    // Generate mock tokenId (in real implementation, this would come from NFT mint)
    const tokenId = Date.now() + Math.floor(Math.random() * 1000);

    // Create character NFT (initially in wallet, not bound to game)
    const newCharacter = new Character({
      walletAddress: walletAddress.toLowerCase(),
      characterName: `${result.rarity} ${className}`,
      characterClass,
      level: 1,
      exp: 0,
      ...bonusedStats,
      isNFT: true,
      isBoundToAccount: false, // Starts in wallet
      tokenId,
    });

    await newCharacter.save();

    res.json({ 
      success: true, 
      result: {
        rarity: result.rarity,
        characterClass: className,
        tokenId,
        message: `You summoned a ${result.rarity} ${className}!`,
        character: newCharacter,
      },
      user 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
