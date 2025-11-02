import { Router, Request, Response } from 'express';
import Character, { CharacterClass, Rarity } from '../models/Character.model';

const router = Router();

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

// Get passive skills for each class
const getClassPassiveSkills = (characterClass: CharacterClass) => {
  const passives = {
    [CharacterClass.WARRIOR]: [
      { name: 'Iron Will', description: 'Increased defense and HP regeneration', effect: '+15% VIT, +2% HP Regen per turn' },
      { name: 'Battle Rage', description: 'Deal more damage when HP is low', effect: '+20% STR when HP < 30%' },
    ],
    [CharacterClass.MAGE]: [
      { name: 'Arcane Mastery', description: 'Enhanced magical power', effect: '+20% INT, +10% Magic DMG' },
      { name: 'Mana Shield', description: 'Chance to avoid damage', effect: '15% chance to dodge attacks' },
    ],
    [CharacterClass.ARCHER]: [
      { name: 'Eagle Eye', description: 'Increased critical hit chance', effect: '+15% Critical Rate' },
      { name: 'Swift Shot', description: 'Attack first in combat', effect: '+25% AGI, Always attack first' },
    ],
    [CharacterClass.ROGUE]: [
      { name: 'Shadow Step', description: 'Extreme evasion and luck', effect: '+20% AGI, +15% LUK' },
      { name: 'Backstab', description: 'Massive critical damage', effect: '+50% Critical DMG' },
    ],
    [CharacterClass.CLERIC]: [
      { name: 'Divine Blessing', description: 'Heal after each battle', effect: 'Restore 20% HP after combat' },
      { name: 'Holy Light', description: 'Increased magic and healing', effect: '+15% INT, +10% Healing' },
    ],
    [CharacterClass.PALADIN]: [
      { name: 'Holy Shield', description: 'Reduce incoming damage', effect: '-20% DMG taken' },
      { name: 'Guardian', description: 'Balanced offense and defense', effect: '+10% STR, +10% VIT' },
    ],
  };
  return passives[characterClass];
};

// GET /api/characters/:walletAddress - Get all characters for wallet
router.get('/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const { filter } = req.query; // 'ingame', 'wallet', or 'all'

    let query: any = { walletAddress: walletAddress.toLowerCase() };

    if (filter === 'ingame') {
      // Characters bound to account (starter + imported NFTs)
      query.isBoundToAccount = true;
    } else if (filter === 'wallet') {
      // NFT characters in wallet but not imported to game yet
      query.isNFT = true;
      query.isBoundToAccount = false;
    }

    const characters = await Character.find(query).sort({ createdAt: 1 });

    res.json({
      success: true,
      characters,
      counts: {
        total: characters.length,
        ingame: await Character.countDocuments({ walletAddress: walletAddress.toLowerCase(), isBoundToAccount: true }),
        wallet: await Character.countDocuments({ walletAddress: walletAddress.toLowerCase(), isNFT: true, isBoundToAccount: false }),
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/characters/create-starter - Create starter Warrior (called on first login)
router.post('/create-starter', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ success: false, error: 'Wallet address required' });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Check if starter character already exists
    const existingStarter = await Character.findOne({
      walletAddress: normalizedAddress,
      isNFT: false,
      characterClass: CharacterClass.WARRIOR
    });

    if (existingStarter) {
      return res.status(400).json({ 
        success: false, 
        error: 'Starter character already exists',
        character: existingStarter
      });
    }

    // Create starter Warrior
    const baseStats = getBaseStats(CharacterClass.WARRIOR);
    const passiveSkills = getClassPassiveSkills(CharacterClass.WARRIOR);
    
    const starterCharacter = new Character({
      walletAddress: normalizedAddress,
      characterName: 'Starter Warrior',
      characterClass: CharacterClass.WARRIOR,
      rarity: 0, // COMMON
      level: 1,
      exp: 0,
      expRequired: 100,
      ...baseStats,
      passiveSkills,
      equipment: {}, // Empty equipment
      isNFT: false,
      isBoundToAccount: true,
      tokenId: null,
    });

    await starterCharacter.save();

    res.json({
      success: true,
      message: 'Starter character created',
      character: starterCharacter
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/characters/import-nft - Import NFT character from wallet to game
router.post('/import-nft', async (req: Request, res: Response) => {
  try {
    const { walletAddress, tokenId } = req.body;

    if (!walletAddress || tokenId === undefined) {
      return res.status(400).json({ success: false, error: 'Wallet address and tokenId required' });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Find the NFT character in wallet (not bound yet)
    const character = await Character.findOne({
      walletAddress: normalizedAddress,
      tokenId,
      isNFT: true,
      isBoundToAccount: false
    });

    if (!character) {
      return res.status(404).json({ 
        success: false, 
        error: 'NFT character not found in wallet or already imported' 
      });
    }

    // Bind to account (move to in-game)
    character.isBoundToAccount = true;
    await character.save();

    res.json({
      success: true,
      message: 'NFT character imported to game',
      character
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/characters/add-from-gacha - Add character from gacha summon
router.post('/add-from-gacha', async (req: Request, res: Response) => {
  try {
    const { walletAddress, tokenId, characterClass, characterName, rarity } = req.body;

    if (!walletAddress || tokenId === undefined || characterClass === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'walletAddress, tokenId, and characterClass required' 
      });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Check if character with this tokenId already exists
    const existing = await Character.findOne({ tokenId });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'Character with this tokenId already exists' 
      });
    }

    // Get base stats and passive skills for the class
    const baseStats = getBaseStats(characterClass);
    const passiveSkills = getClassPassiveSkills(characterClass);
    
    // Create new NFT character (initially in wallet, not bound)
    const newCharacter = new Character({
      walletAddress: normalizedAddress,
      characterName: characterName || `${CharacterClass[characterClass]} Hero`,
      characterClass,
      rarity: rarity || 0,
      level: 1,
      exp: 0,
      expRequired: 100,
      ...baseStats,
      passiveSkills,
      equipment: {},
      isNFT: true,
      isBoundToAccount: false, // Starts in wallet
      tokenId,
    });

    await newCharacter.save();

    res.json({
      success: true,
      message: 'NFT character created from gacha',
      character: newCharacter
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/characters/:id/level-up - Add EXP and level up
router.post('/:id/level-up', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { expGained } = req.body;

    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    character.exp += expGained;

    // Level up logic
    let leveledUp = false;
    while (character.exp >= character.level * 100 && character.level < 100) {
      character.exp -= character.level * 100;
      character.level += 1;
      
      // Stat increases per level
      character.str += 2;
      character.agi += 2;
      character.int += 2;
      character.luk += 1;
      character.vit += 2;
      character.maxHp += 10;
      character.hp = character.maxHp; // Full heal on level up
      
      leveledUp = true;
    }

    await character.save();

    res.json({
      success: true,
      character,
      leveledUp,
      message: leveledUp ? `Leveled up to ${character.level}!` : 'EXP gained'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/characters/:id/heal - Heal character
router.post('/:id/heal', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { healAmount } = req.body;

    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    character.hp = Math.min(character.hp + healAmount, character.maxHp);
    await character.save();

    res.json({
      success: true,
      character,
      message: `Healed ${healAmount} HP`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/characters/detail/:id - Get single character details
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id);

    if (!character) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    res.json({
      success: true,
      character
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/characters/:id - Delete NFT character (only if not bound and not starter)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    // Cannot delete starter character or bound characters
    if (!character.isNFT || character.isBoundToAccount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete starter or in-game characters' 
      });
    }

    await Character.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Character deleted'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/characters/:id/equip - Equip item to character
router.post('/:id/equip', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { slot, itemId, itemName, itemType, stats } = req.body;

    // Validate slot
    const validSlots = ['weapon', 'armor', 'accessory1', 'accessory2', 'accessory3'];
    if (!validSlots.includes(slot)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid slot. Use: weapon, armor, accessory1, accessory2, accessory3' 
      });
    }

    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    // Equip the item
    if (!character.equipment) {
      character.equipment = {};
    }

    character.equipment[slot as keyof typeof character.equipment] = {
      itemId: itemId || undefined,
      itemName: itemName || undefined,
      itemType: itemType || undefined,
      stats: stats || { str: 0, agi: 0, int: 0, luk: 0, vit: 0, hp: 0 },
    };

    await character.save();

    res.json({
      success: true,
      message: `${itemName || 'Item'} equipped to ${slot}`,
      character
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/characters/:id/unequip - Unequip item from character
router.post('/:id/unequip', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { slot } = req.body;

    const validSlots = ['weapon', 'armor', 'accessory1', 'accessory2', 'accessory3'];
    if (!validSlots.includes(slot)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid slot' 
      });
    }

    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    // Unequip the item
    if (character.equipment && character.equipment[slot as keyof typeof character.equipment]) {
      character.equipment[slot as keyof typeof character.equipment] = undefined;
    }

    await character.save();

    res.json({
      success: true,
      message: `Unequipped ${slot}`,
      character
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
