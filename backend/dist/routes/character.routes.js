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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Character_model_1 = __importStar(require("../models/Character.model"));
const router = (0, express_1.Router)();
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
// GET /api/characters/:walletAddress - Get all characters for wallet
router.get('/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const { filter } = req.query; // 'ingame', 'wallet', or 'all'
        let query = { walletAddress: walletAddress.toLowerCase() };
        if (filter === 'ingame') {
            // Characters bound to account (starter + imported NFTs)
            query.isBoundToAccount = true;
        }
        else if (filter === 'wallet') {
            // NFT characters in wallet but not imported to game yet
            query.isNFT = true;
            query.isBoundToAccount = false;
        }
        const characters = await Character_model_1.default.find(query).sort({ createdAt: 1 });
        res.json({
            success: true,
            characters,
            counts: {
                total: characters.length,
                ingame: await Character_model_1.default.countDocuments({ walletAddress: walletAddress.toLowerCase(), isBoundToAccount: true }),
                wallet: await Character_model_1.default.countDocuments({ walletAddress: walletAddress.toLowerCase(), isNFT: true, isBoundToAccount: false }),
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/characters/create-starter - Create starter Warrior (called on first login)
router.post('/create-starter', async (req, res) => {
    try {
        const { walletAddress } = req.body;
        if (!walletAddress) {
            return res.status(400).json({ success: false, error: 'Wallet address required' });
        }
        const normalizedAddress = walletAddress.toLowerCase();
        // Check if starter character already exists
        const existingStarter = await Character_model_1.default.findOne({
            walletAddress: normalizedAddress,
            isNFT: false,
            characterClass: Character_model_1.CharacterClass.WARRIOR
        });
        if (existingStarter) {
            return res.status(400).json({
                success: false,
                error: 'Starter character already exists',
                character: existingStarter
            });
        }
        // Create starter Warrior
        const baseStats = getBaseStats(Character_model_1.CharacterClass.WARRIOR);
        const starterCharacter = new Character_model_1.default({
            walletAddress: normalizedAddress,
            characterName: 'Starter Warrior',
            characterClass: Character_model_1.CharacterClass.WARRIOR,
            level: 1,
            exp: 0,
            ...baseStats,
            isNFT: false,
            isBoundToAccount: true,
            tokenId: null,
        });
        await starterCharacter.save();
        res.json({
            success: true,
            message: 'Starter character created',
            character: starterCharacter
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/characters/import-nft - Import NFT character from wallet to game
router.post('/import-nft', async (req, res) => {
    try {
        const { walletAddress, tokenId } = req.body;
        if (!walletAddress || tokenId === undefined) {
            return res.status(400).json({ success: false, error: 'Wallet address and tokenId required' });
        }
        const normalizedAddress = walletAddress.toLowerCase();
        // Find the NFT character in wallet (not bound yet)
        const character = await Character_model_1.default.findOne({
            walletAddress: normalizedAddress,
            tokenId,
            isNFT: true,
            isBoundToAccount: false
        });
        if (!character) {
            return res.status(404).json({
                success: false,
                error: 'NFT character not found in wallet or already imported'
            });
        }
        // Bind to account (move to in-game)
        character.isBoundToAccount = true;
        await character.save();
        res.json({
            success: true,
            message: 'NFT character imported to game',
            character
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/characters/add-from-gacha - Add character from gacha summon
router.post('/add-from-gacha', async (req, res) => {
    try {
        const { walletAddress, tokenId, characterClass, characterName } = req.body;
        if (!walletAddress || tokenId === undefined || characterClass === undefined) {
            return res.status(400).json({
                success: false,
                error: 'walletAddress, tokenId, and characterClass required'
            });
        }
        const normalizedAddress = walletAddress.toLowerCase();
        // Check if character with this tokenId already exists
        const existing = await Character_model_1.default.findOne({ tokenId });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Character with this tokenId already exists'
            });
        }
        // Get base stats for the class
        const baseStats = getBaseStats(characterClass);
        // Create new NFT character (initially in wallet, not bound)
        const newCharacter = new Character_model_1.default({
            walletAddress: normalizedAddress,
            characterName: characterName || `${Character_model_1.CharacterClass[characterClass]} Hero`,
            characterClass,
            level: 1,
            exp: 0,
            ...baseStats,
            isNFT: true,
            isBoundToAccount: false, // Starts in wallet
            tokenId,
        });
        await newCharacter.save();
        res.json({
            success: true,
            message: 'NFT character created from gacha',
            character: newCharacter
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/characters/:id/level-up - Add EXP and level up
router.post('/:id/level-up', async (req, res) => {
    try {
        const { id } = req.params;
        const { expGained } = req.body;
        const character = await Character_model_1.default.findById(id);
        if (!character) {
            return res.status(404).json({ success: false, error: 'Character not found' });
        }
        character.exp += expGained;
        // Level up logic
        let leveledUp = false;
        while (character.exp >= character.level * 100 && character.level < 100) {
            character.exp -= character.level * 100;
            character.level += 1;
            // Stat increases per level
            character.str += 2;
            character.agi += 2;
            character.int += 2;
            character.luk += 1;
            character.vit += 2;
            character.maxHp += 10;
            character.hp = character.maxHp; // Full heal on level up
            leveledUp = true;
        }
        await character.save();
        res.json({
            success: true,
            character,
            leveledUp,
            message: leveledUp ? `Leveled up to ${character.level}!` : 'EXP gained'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/characters/:id/heal - Heal character
router.post('/:id/heal', async (req, res) => {
    try {
        const { id } = req.params;
        const { healAmount } = req.body;
        const character = await Character_model_1.default.findById(id);
        if (!character) {
            return res.status(404).json({ success: false, error: 'Character not found' });
        }
        character.hp = Math.min(character.hp + healAmount, character.maxHp);
        await character.save();
        res.json({
            success: true,
            character,
            message: `Healed ${healAmount} HP`
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/characters/detail/:id - Get single character details
router.get('/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const character = await Character_model_1.default.findById(id);
        if (!character) {
            return res.status(404).json({ success: false, error: 'Character not found' });
        }
        res.json({
            success: true,
            character
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// DELETE /api/characters/:id - Delete NFT character (only if not bound and not starter)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const character = await Character_model_1.default.findById(id);
        if (!character) {
            return res.status(404).json({ success: false, error: 'Character not found' });
        }
        // Cannot delete starter character or bound characters
        if (!character.isNFT || character.isBoundToAccount) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete starter or in-game characters'
            });
        }
        await Character_model_1.default.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Character deleted'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=character.routes.js.map