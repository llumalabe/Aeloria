import { Router, Request, Response } from 'express';
import SurvivorNFT from '../models/SurvivorNFT.model';

const router = Router();

/**
 * GET /api/nft/metadata/:tokenId
 * Returns NFT metadata in OpenSea/ERC721 standard format
 */
router.get('/metadata/:tokenId', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;

    // Find NFT in database
    const nft = await SurvivorNFT.findOne({ tokenId: Number(tokenId) });

    if (!nft) {
      return res.status(404).json({
        error: 'NFT not found',
        message: `Survivor #${tokenId} does not exist`,
      });
    }

    // Build attributes array for OpenSea
    const attributes: Array<{
      trait_type: string;
      value: string | number;
      display_type?: string;
      max_value?: number;
    }> = [
      {
        trait_type: 'Class',
        value: nft.class,
      },
      {
        trait_type: 'Rarity',
        value: nft.rarity,
      },
      {
        trait_type: 'Level',
        value: nft.level,
        display_type: 'number',
      },
      {
        trait_type: 'HP',
        value: nft.stats.hp,
        max_value: nft.stats.maxHp,
        display_type: 'boost_number',
      },
      {
        trait_type: 'Strength',
        value: nft.stats.strength,
        display_type: 'boost_number',
      },
      {
        trait_type: 'Agility',
        value: nft.stats.agility,
        display_type: 'boost_number',
      },
      {
        trait_type: 'Intelligence',
        value: nft.stats.intelligence,
        display_type: 'boost_number',
      },
      {
        trait_type: 'Luck',
        value: nft.stats.luck,
        display_type: 'boost_number',
      },
      {
        trait_type: 'Vitality',
        value: nft.stats.vitality,
        display_type: 'boost_number',
      },
      {
        trait_type: 'Days Survived',
        value: nft.survivedDays,
        display_type: 'number',
      },
      {
        trait_type: 'Zombies Killed',
        value: nft.zombiesKilled,
        display_type: 'number',
      },
    ];

    // Add equipment if exists
    if (nft.equipment.weapon) {
      attributes.push({
        trait_type: 'Weapon',
        value: nft.equipment.weapon,
      });
    }
    if (nft.equipment.armor) {
      attributes.push({
        trait_type: 'Armor',
        value: nft.equipment.armor,
      });
    }
    if (nft.equipment.accessory) {
      attributes.push({
        trait_type: 'Accessory',
        value: nft.equipment.accessory,
      });
    }

    // Return OpenSea-compatible metadata
    const metadata = {
      name: nft.name,
      description: nft.description,
      image: nft.imageUrl,
      external_url: `${process.env.FRONTEND_URL || 'https://aeloria-two.vercel.app'}/nft/${tokenId}`,
      attributes,
    };

    res.json(metadata);
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch NFT metadata',
    });
  }
});

/**
 * POST /api/nft/mint
 * Create new NFT metadata (called after minting on-chain)
 */
router.post('/mint', async (req: Request, res: Response) => {
  try {
    const {
      tokenId,
      ownerAddress,
      class: survivorClass,
      rarity = 'Common',
    } = req.body;

    // Validate required fields
    if (!tokenId || !ownerAddress || !survivorClass) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'tokenId, ownerAddress, and class are required',
      });
    }

    // Check if NFT already exists
    const existing = await SurvivorNFT.findOne({ tokenId });
    if (existing) {
      return res.status(409).json({
        error: 'NFT already exists',
        message: `Survivor #${tokenId} is already minted`,
      });
    }

    // Generate stats based on class and rarity
    const baseStats = generateStats(survivorClass, rarity);

    // Create NFT metadata
    const nft = await SurvivorNFT.create({
      tokenId,
      ownerAddress: ownerAddress.toLowerCase(),
      name: `Survivor #${tokenId}`,
      description: `A ${rarity} ${survivorClass} who survived the zombie apocalypse`,
      imageUrl: `${process.env.CDN_URL || 'https://aeloria-two.vercel.app/images'}/survivors/${survivorClass.toLowerCase()}-${rarity.toLowerCase()}.png`,
      class: survivorClass,
      rarity,
      level: 1,
      exp: 0,
      stats: baseStats,
      skills: getStartingSkills(survivorClass),
      survivedDays: 0,
      zombiesKilled: 0,
    });

    res.status(201).json({
      success: true,
      message: 'NFT metadata created',
      nft: {
        tokenId: nft.tokenId,
        name: nft.name,
        class: nft.class,
        rarity: nft.rarity,
      },
    });
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create NFT metadata',
    });
  }
});

/**
 * GET /api/nft/owner/:address
 * Get all NFTs owned by an address
 */
router.get('/owner/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    const nfts = await SurvivorNFT.find({
      ownerAddress: address.toLowerCase(),
    }).sort({ tokenId: 1 });

    res.json({
      success: true,
      count: nfts.length,
      nfts: nfts.map((nft) => ({
        tokenId: nft.tokenId,
        name: nft.name,
        class: nft.class,
        rarity: nft.rarity,
        level: nft.level,
        imageUrl: nft.imageUrl,
      })),
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch NFTs',
    });
  }
});

/**
 * PATCH /api/nft/:tokenId/stats
 * Update NFT stats (for game progression)
 */
router.patch('/:tokenId/stats', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    const updates = req.body;

    const nft = await SurvivorNFT.findOneAndUpdate(
      { tokenId: Number(tokenId) },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!nft) {
      return res.status(404).json({
        error: 'NFT not found',
      });
    }

    res.json({
      success: true,
      message: 'NFT stats updated',
      nft,
    });
  } catch (error) {
    console.error('Error updating NFT:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update NFT',
    });
  }
});

// Helper function to generate stats
function generateStats(survivorClass: string, rarity: string) {
  const rarityMultiplier = {
    Common: 1,
    Uncommon: 1.2,
    Rare: 1.5,
    Epic: 2,
    Legendary: 3,
  }[rarity] || 1;

  const classStats = {
    Soldier: {
      hp: 150,
      maxHp: 150,
      strength: 20,
      agility: 12,
      intelligence: 10,
      luck: 8,
      vitality: 18,
    },
    Medic: {
      hp: 100,
      maxHp: 100,
      strength: 8,
      agility: 12,
      intelligence: 20,
      luck: 15,
      vitality: 12,
    },
    Engineer: {
      hp: 120,
      maxHp: 120,
      strength: 12,
      agility: 10,
      intelligence: 18,
      luck: 12,
      vitality: 14,
    },
    Scout: {
      hp: 110,
      maxHp: 110,
      strength: 10,
      agility: 20,
      intelligence: 12,
      luck: 18,
      vitality: 10,
    },
  }[survivorClass] || {
    hp: 100,
    maxHp: 100,
    strength: 10,
    agility: 10,
    intelligence: 10,
    luck: 10,
    vitality: 10,
  };

  // Apply rarity multiplier
  return {
    hp: Math.floor(classStats.hp * rarityMultiplier),
    maxHp: Math.floor(classStats.maxHp * rarityMultiplier),
    strength: Math.floor(classStats.strength * rarityMultiplier),
    agility: Math.floor(classStats.agility * rarityMultiplier),
    intelligence: Math.floor(classStats.intelligence * rarityMultiplier),
    luck: Math.floor(classStats.luck * rarityMultiplier),
    vitality: Math.floor(classStats.vitality * rarityMultiplier),
  };
}

// Helper function to get starting skills
function getStartingSkills(survivorClass: string): string[] {
  const skills = {
    Soldier: ['Headshot', 'Last Stand'],
    Medic: ['First Aid', 'Revive'],
    Engineer: ['Repair', 'Build Trap'],
    Scout: ['Scavenge', 'Stealth'],
  }[survivorClass] || [];

  return skills;
}

export default router;
