import { Router } from 'express';

interface CombatCharacter {
  str: number;
  agi: number;
  int: number;
  luk: number;
}

const router = Router();

// POST /api/combat/calculate - Calculate combat result
router.post('/calculate', async (req, res) => {
  try {
    const { attacker, defender }: { attacker: CombatCharacter; defender: CombatCharacter } = req.body;

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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to calculate combat power
function calculatePower(character: CombatCharacter): number {
  const { str, agi, int, luk } = character;
  return (str * 1.5) + (agi * 1.2) + (int * 1.3) + (luk * 0.8);
}

export default router;
