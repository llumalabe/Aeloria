"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Quest_model_1 = __importDefault(require("../models/Quest.model"));
const router = (0, express_1.Router)();
// GET /api/quests - Get all available quests
router.get('/', async (req, res) => {
    try {
        const quests = await Quest_model_1.default.find({ isActive: true });
        res.json({ success: true, quests });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/quests/:id/complete - Complete quest
router.post('/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const quest = await Quest_model_1.default.findById(id);
        if (!quest) {
            return res.status(404).json({ success: false, error: 'Quest not found' });
        }
        res.json({ success: true, rewards: quest.rewards });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=quest.routes.js.map