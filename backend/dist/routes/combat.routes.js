"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/combat/calculate - Calculate combat result
router.post('/calculate', async (req, res) => {
    try {
        const { attacker, defender } = req.body;
        // Simple combat calculation
        const attackerPower = calculatePower(attacker);
        const defenderPower = calculatePower(defender);
        const attackerHit = Math.random() * attackerPower;
        const defenderHit = Math.random() * defenderPower;
        const winner = attackerHit > defenderHit ? 'attacker' : 'defender';
        const damage = Math.abs(attackerHit - defenderHit);
        res.json({
            success: true,
            result: {
                winner,
                damage: Math.floor(damage),
                attackerPower,
                defenderPower,
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// Helper function to calculate combat power
function calculatePower(character) {
    const { str, agi, int, luk } = character;
    return (str * 1.5) + (agi * 1.2) + (int * 1.3) + (luk * 0.8);
}
exports.default = router;
//# sourceMappingURL=combat.routes.js.map