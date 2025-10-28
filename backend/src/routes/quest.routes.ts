import { Router } from 'express';
import Quest from '../models/Quest.model';

const router = Router();

// GET /api/quests - Get all available quests
router.get('/', async (req, res) => {
  try {
    const quests = await Quest.find({ isActive: true });
    res.json({ success: true, quests });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/quests/:id/complete - Complete quest
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const quest = await Quest.findById(id);
    
    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found' });
    }

    res.json({ success: true, rewards: quest.rewards });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
