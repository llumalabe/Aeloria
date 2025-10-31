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
exports.CharacterClass = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Character classes enum
var CharacterClass;
(function (CharacterClass) {
    CharacterClass[CharacterClass["WARRIOR"] = 0] = "WARRIOR";
    CharacterClass[CharacterClass["MAGE"] = 1] = "MAGE";
    CharacterClass[CharacterClass["ARCHER"] = 2] = "ARCHER";
    CharacterClass[CharacterClass["ROGUE"] = 3] = "ROGUE";
    CharacterClass[CharacterClass["CLERIC"] = 4] = "CLERIC";
    CharacterClass[CharacterClass["PALADIN"] = 5] = "PALADIN";
})(CharacterClass || (exports.CharacterClass = CharacterClass = {}));
const CharacterSchema = new mongoose_1.Schema({
    walletAddress: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },
    characterName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    characterClass: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3, 4, 5], // Warrior, Mage, Archer, Rogue, Cleric, Paladin
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 100,
    },
    exp: {
        type: Number,
        default: 0,
        min: 0,
    },
    hp: {
        type: Number,
        required: true,
    },
    maxHp: {
        type: Number,
        required: true,
    },
    str: {
        type: Number,
        required: true,
    },
    agi: {
        type: Number,
        required: true,
    },
    int: {
        type: Number,
        required: true,
    },
    luk: {
        type: Number,
        required: true,
    },
    vit: {
        type: Number,
        required: true,
    },
    // NFT fields
    tokenId: {
        type: Number,
        sparse: true, // Allows multiple null values
    },
    isNFT: {
        type: Boolean,
        default: false,
    },
    isBoundToAccount: {
        type: Boolean,
        default: true, // Default is in-game (bound)
    },
    // Equipment
    equippedWeapon: {
        type: Number,
    },
    equippedArmor: {
        type: Number,
    },
    equippedAccessory: {
        type: Number,
    },
    lastAdventureTime: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Index for faster queries
CharacterSchema.index({ walletAddress: 1, isNFT: 1, isBoundToAccount: 1 });
exports.default = mongoose_1.default.model('Character', CharacterSchema);
//# sourceMappingURL=Character.model.js.map