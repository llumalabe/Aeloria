"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_model_1 = __importDefault(require("../models/User.model"));
const Character_model_1 = __importStar(require("../models/Character.model"));
const router = (0, express_1.Router)();
// Character class names
const CLASS_NAMES = ['Warrior', 'Mage', 'Archer', 'Rogue', 'Cleric', 'Paladin'];
// Get base stats for each class
const getBaseStats = (characterClass) => {
    const baseStats = {
        [Character_model_1.CharacterClass.WARRIOR]: { hp: 150, maxHp: 150, str: 15, agi: 8, int: 5, luk: 7, vit: 12 },
        [Character_model_1.CharacterClass.MAGE]: { hp: 80, maxHp: 80, str: 5, agi: 7, int: 18, luk: 10, vit: 6 },
        [Character_model_1.CharacterClass.ARCHER]: { hp: 100, maxHp: 100, str: 8, agi: 16, int: 7, luk: 12, vit: 8 },
        [Character_model_1.CharacterClass.ROGUE]: { hp: 90, maxHp: 90, str: 10, agi: 17, int: 6, luk: 15, vit: 7 },
        [Character_model_1.CharacterClass.CLERIC]: { hp: 110, maxHp: 110, str: 6, agi: 8, int: 15, luk: 9, vit: 11 },
        [Character_model_1.CharacterClass.PALADIN]: { hp: 140, maxHp: 140, str: 12, agi: 9, int: 10, luk: 8, vit: 13 },
    };
    return baseStats[characterClass];
};
// POST /api/gacha/summon - Perform gacha summon for character
router.post('/summon', async (req, res) => {
    try {
        const { walletAddress, summonType } = req.body;
        const user = await User_model_1.default.findOne({ walletAddress: walletAddress.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        // Summon costs
        const costs = {
            basic: { gold: 1000, premium: 0, tokens: 0 },
            premium: { gold: 0, premium: 100, tokens: 0 },
            legendary: { gold: 0, premium: 0, tokens: 10 },
        };
        const cost = costs[summonType];
        if (!cost) {
            return res.status(400).json({ success: false, error: 'Invalid summon type' });
        }
        // Check if user has enough currency
        if (user.gold < cost.gold || user.premium < cost.premium || user.tokens < cost.tokens) {
            return res.status(400).json({ success: false, error: 'Insufficient currency' });
        }
        // Deduct cost
        user.gold -= cost.gold;
        user.premium -= cost.premium;
        user.tokens -= cost.tokens;
        await user.save();
        // Roll for character class (random)
        const characterClass = Math.floor(Math.random() * 6); // 0-5
        const className = CLASS_NAMES[characterClass];
        // Determine rarity based on summon type (affects starting stats bonus)
        const rarityRolls = {
            basic: [
                { rarity: 'Common', statBonus: 0, probability: 0.60 },
                { rarity: 'Uncommon', statBonus: 2, probability: 0.30 },
                { rarity: 'Rare', statBonus: 5, probability: 0.10 },
            ],
            premium: [
                { rarity: 'Uncommon', statBonus: 2, probability: 0.40 },
                { rarity: 'Rare', statBonus: 5, probability: 0.40 },
                { rarity: 'Epic', statBonus: 10, probability: 0.15 },
                { rarity: 'Legendary', statBonus: 20, probability: 0.05 },
            ],
            legendary: [
                { rarity: 'Epic', statBonus: 10, probability: 0.50 },
                { rarity: 'Legendary', statBonus: 20, probability: 0.40 },
                { rarity: 'Mythic', statBonus: 30, probability: 0.10 },
            ],
        };
        const rolls = rarityRolls[summonType];
        const random = Math.random();
        let cumulativeProbability = 0;
        let result = rolls[0];
        for (const roll of rolls) {
            cumulativeProbability += roll.probability;
            if (random <= cumulativeProbability) {
                result = roll;
                break;
            }
        }
        // Get base stats and apply rarity bonus
        const baseStats = getBaseStats(characterClass);
        const bonusedStats = {
            hp: baseStats.hp + (result.statBonus * 2),
            maxHp: baseStats.maxHp + (result.statBonus * 2),
            str: baseStats.str + result.statBonus,
            agi: baseStats.agi + result.statBonus,
            int: baseStats.int + result.statBonus,
            luk: baseStats.luk + result.statBonus,
            vit: baseStats.vit + result.statBonus,
        };
        // Generate mock tokenId (in real implementation, this would come from NFT mint)
        const tokenId = Date.now() + Math.floor(Math.random() * 1000);
        // Create character NFT (initially in wallet, not bound to game)
        const newCharacter = new Character_model_1.default({
            walletAddress: walletAddress.toLowerCase(),
            characterName: `${result.rarity} ${className}`,
            characterClass,
            level: 1,
            exp: 0,
            ...bonusedStats,
            isNFT: true,
            isBoundToAccount: false, // Starts in wallet
            tokenId,
        });
        await newCharacter.save();
        res.json({
            success: true,
            result: {
                rarity: result.rarity,
                characterClass: className,
                tokenId,
                message: `You summoned a ${result.rarity} ${className}!`,
                character: newCharacter,
            },
            user
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=gacha.routes.js.map