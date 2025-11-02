import { Router } from 'express';
import Dungeon from '../models/Dungeon.model';
import User from '../models/User.model';

const router = Router();

// GET /api/dungeon/list - Get all available dungeons
router.get('/list', async (req, res) => {
  try {
    let dungeons = await Dungeon.find({ isActive: true });
    
    // If no dungeons exist, create default ones
    if (dungeons.length === 0) {
      const defaultDungeons = [
        {
          name: '🌲 Forest of Whispers',
          difficulty: 'Easy' as const,
          minLevel: 1,
          maxLevel: 5,
          energyCost: 5,
          description: 'A mysterious forest filled with weak monsters. Perfect for beginners.',
          floors: 3,
          rewards: { 
            gold: { min: 50, max: 150 }, 
            exp: { min: 30, max: 80 },
            items: []
          },
          events: [
            { type: 'combat', title: 'Wild Slime', description: 'A slime blocks your path!', probability: 0.6, effects: {} },
            { type: 'treasure', title: 'Treasure Chest', description: 'You found a chest!', probability: 0.3, effects: { gold: 100 } },
            { type: 'rest', title: 'Safe Spot', description: 'A peaceful place to rest.', probability: 0.1, effects: { hp: 50 } },
          ],
          boss: {
            name: 'Forest Guardian',
            hp: 500,
            attack: 50,
            defense: 20,
            rewards: { gold: 200, exp: 150, items: [] }
          },
          isActive: true,
        },
        {
          name: '⛰️ Mountain Cavern',
          difficulty: 'Normal' as const,
          minLevel: 5,
          maxLevel: 10,
          energyCost: 10,
          description: 'Dark caves inhabited by goblins and bats.',
          floors: 5,
          rewards: { 
            gold: { min: 150, max: 400 }, 
            exp: { min: 100, max: 250 },
            items: []
          },
          events: [
            { type: 'combat', title: 'Goblin Warrior', description: 'An armed goblin attacks!', probability: 0.5, effects: {} },
            { type: 'trap', title: 'Spike Trap', description: 'Watch your step!', probability: 0.2, effects: { damage: 30 } },
            { type: 'treasure', title: 'Hidden Loot', description: 'Gold hidden in the rocks!', probability: 0.2, effects: { gold: 200 } },
            { type: 'rest', title: 'Safe Spot', description: 'Rest here.', probability: 0.1, effects: { hp: 80 } },
          ],
          boss: {
            name: 'Goblin King',
            hp: 1000,
            attack: 80,
            defense: 40,
            rewards: { gold: 400, exp: 300, items: [] }
          },
          isActive: true,
        },
        {
          name: '🏰 Ancient Ruins',
          difficulty: 'Hard' as const,
          minLevel: 10,
          maxLevel: 20,
          energyCost: 15,
          description: 'Ruins guarded by powerful undead creatures.',
          floors: 7,
          rewards: { 
            gold: { min: 400, max: 800 }, 
            exp: { min: 300, max: 600 },
            items: []
          },
          events: [
            { type: 'combat', title: 'Skeleton Knight', description: 'An undead warrior rises!', probability: 0.6, effects: {} },
            { type: 'trap', title: 'Curse Trap', description: 'Dark magic drains your health!', probability: 0.2, effects: { damage: 50 } },
            { type: 'treasure', title: 'Ancient Artifact', description: 'Rare treasure!', probability: 0.1, effects: { gold: 500 } },
            { type: 'rest', title: 'Meditation Room', description: 'Restore your energy.', probability: 0.1, effects: { hp: 100 } },
          ],
          boss: {
            name: 'Bone Lord',
            hp: 2000,
            attack: 120,
            defense: 60,
            rewards: { gold: 800, exp: 600, items: [] }
          },
          isActive: true,
        },
      ];

      dungeons = await Dungeon.insertMany(defaultDungeons);
    }
    
    res.json({ success: true, dungeons });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/dungeon/:id/enter - Enter dungeon
router.post('/:id/enter', async (req, res) => {
  try {
    const { id } = req.params;
    const { walletAddress } = req.body;

    const dungeon = await Dungeon.findById(id);
    if (!dungeon) {
      return res.status(404).json({ success: false, error: 'Dungeon not found' });
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check level requirement
    if (user.level < dungeon.minLevel) {
      return res.status(400).json({ 
        success: false, 
        error: `Level ${dungeon.minLevel} required` 
      });
    }

    // Random event generation
    const events = [];
    for (let floor = 1; floor <= dungeon.floors; floor++) {
      const randomEvent = dungeon.events[Math.floor(Math.random() * dungeon.events.length)];
      const roll = Math.random();
      
      if (roll < randomEvent.probability) {
        events.push({
          floor,
          ...randomEvent,
        });
      }
    }

    // Boss encounter on last floor
    const boss = dungeon.bosses[Math.floor(Math.random() * dungeon.bosses.length)];
    events.push({
      floor: dungeon.floors,
      type: 'Boss',
      description: `You encountered ${boss.name}!`,
      boss,
    });

    res.json({ success: true, dungeon, events });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/dungeon/complete - Complete dungeon
router.post('/complete', async (req, res) => {
  try {
    const { walletAddress, dungeonId, success: dungeonSuccess } = req.body;

    const dungeon = await Dungeon.findById(dungeonId);
    if (!dungeon) {
      return res.status(404).json({ success: false, error: 'Dungeon not found' });
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (dungeonSuccess) {
      // Calculate rewards
      const goldReward = Math.floor(
        Math.random() * (dungeon.rewards.gold.max - dungeon.rewards.gold.min) +
        dungeon.rewards.gold.min
      );
      const expReward = Math.floor(
        Math.random() * (dungeon.rewards.exp.max - dungeon.rewards.exp.min) +
        dungeon.rewards.exp.min
      );

      user.gold += goldReward;
      user.exp += expReward;

      // Check for level up
      const expNeeded = user.level * 100;
      if (user.exp >= expNeeded) {
        user.level++;
        user.exp -= expNeeded;
      }

      await user.save();

      res.json({ 
        success: true, 
        rewards: { gold: goldReward, exp: expReward },
        user 
      });
    } else {
      res.json({ success: true, message: 'Dungeon failed' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
