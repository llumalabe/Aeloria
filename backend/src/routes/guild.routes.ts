import { Router } from 'express';
import Guild from '../models/Guild.model';

const router = Router();

// GET /api/guilds - Get all guilds
router.get('/', async (req, res) => {
  try {
    const guilds = await Guild.find();
    res.json({ success: true, guilds });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/guilds/create - Create new guild
router.post('/create', async (req, res) => {
  try {
    const { name, description, leaderWallet } = req.body;
    
    const guild = new Guild({
      name,
      description,
      leaderWallet: leaderWallet.toLowerCase(),
      members: [{
        walletAddress: leaderWallet.toLowerCase(),
        role: 'Leader',
      }],
    });

    await guild.save();

    res.json({ success: true, guild });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/guilds/:id/join - Join guild
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { walletAddress } = req.body;

    const guild = await Guild.findById(id);
    if (!guild) {
      return res.status(404).json({ success: false, error: 'Guild not found' });
    }

    if (guild.members.length >= guild.maxMembers) {
      return res.status(400).json({ success: false, error: 'Guild is full' });
    }

    guild.members.push({
      walletAddress: walletAddress.toLowerCase(),
      role: 'Member',
      joinedAt: new Date(),
    });

    await guild.save();

    res.json({ success: true, guild });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
