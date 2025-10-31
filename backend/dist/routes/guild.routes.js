"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Guild_model_1 = __importDefault(require("../models/Guild.model"));
const router = (0, express_1.Router)();
// GET /api/guilds - Get all guilds
router.get('/', async (req, res) => {
    try {
        const guilds = await Guild_model_1.default.find();
        res.json({ success: true, guilds });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/guilds/create - Create new guild
router.post('/create', async (req, res) => {
    try {
        const { name, description, leaderWallet } = req.body;
        const guild = new Guild_model_1.default({
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/guilds/:id/join - Join guild
router.post('/:id/join', async (req, res) => {
    try {
        const { id } = req.params;
        const { walletAddress } = req.body;
        const guild = await Guild_model_1.default.findById(id);
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=guild.routes.js.map