"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dungeon_model_1 = __importDefault(require("../models/Dungeon.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const router = (0, express_1.Router)();
// GET /api/dungeon/list - Get all available dungeons
router.get('/list', async (req, res) => {
    try {
        const dungeons = await Dungeon_model_1.default.find({ isActive: true });
        res.json({ success: true, dungeons });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/dungeon/:id/enter - Enter dungeon
router.post('/:id/enter', async (req, res) => {
    try {
        const { id } = req.params;
        const { walletAddress } = req.body;
        const dungeon = await Dungeon_model_1.default.findById(id);
        if (!dungeon) {
            return res.status(404).json({ success: false, error: 'Dungeon not found' });
        }
        const user = await User_model_1.default.findOne({ walletAddress: walletAddress.toLowerCase() });
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/dungeon/complete - Complete dungeon
router.post('/complete', async (req, res) => {
    try {
        const { walletAddress, dungeonId, success: dungeonSuccess } = req.body;
        const dungeon = await Dungeon_model_1.default.findById(dungeonId);
        if (!dungeon) {
            return res.status(404).json({ success: false, error: 'Dungeon not found' });
        }
        const user = await User_model_1.default.findOne({ walletAddress: walletAddress.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if (dungeonSuccess) {
            // Calculate rewards
            const goldReward = Math.floor(Math.random() * (dungeon.rewards.gold.max - dungeon.rewards.gold.min) +
                dungeon.rewards.gold.min);
            const expReward = Math.floor(Math.random() * (dungeon.rewards.exp.max - dungeon.rewards.exp.min) +
                dungeon.rewards.exp.min);
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
        }
        else {
            res.json({ success: true, message: 'Dungeon failed' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=dungeon.routes.js.map