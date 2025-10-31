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
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        sparse: true,
    },
    gold: {
        type: Number,
        default: 0,
        min: 0,
    },
    premium: {
        type: Number,
        default: 0,
        min: 0,
    },
    tokens: {
        type: Number,
        default: 0,
        min: 0,
    },
    ronTokens: {
        type: Number,
        default: 0,
        min: 0,
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
    },
    exp: {
        type: Number,
        default: 0,
        min: 0,
    },
    energy: {
        type: Number,
        default: 30,
        min: 0,
    },
    maxEnergy: {
        type: Number,
        default: 30,
    },
    lastEnergyReset: {
        type: Date,
        default: Date.now,
    },
    lastLoginDate: {
        type: Date,
        default: Date.now,
    },
    loginStreak: {
        type: Number,
        default: 1,
    },
    totalPlayTime: {
        type: Number,
        default: 0,
    },
    referralCode: {
        type: String,
        required: false,
        unique: true,
    },
    referredBy: {
        type: String,
    },
    achievements: [{
            type: String,
        }],
    seasonPassLevel: {
        type: Number,
        default: 0,
    },
    transactions: [{
            txHash: { type: String, required: true },
            type: { type: String, enum: ['deposit', 'withdraw', 'convert'], required: true },
            tokenType: { type: String, enum: ['AETH', 'RON'], required: true },
            amount: { type: String, required: true },
            fee: { type: String, default: '0' },
            status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'confirmed' },
            timestamp: { type: Date, default: Date.now },
            blockNumber: { type: Number },
            verified: { type: Boolean, default: false }
        }],
}, {
    timestamps: true,
});
// Generate unique referral code
UserSchema.pre('save', function (next) {
    if (!this.referralCode) {
        this.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    next();
});
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.model.js.map