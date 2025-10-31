import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    walletAddress: string;
    username: string;
    email?: string;
    gold: number;
    premium: number;
    tokens: number;
    ronTokens: number;
    level: number;
    exp: number;
    energy: number;
    maxEnergy: number;
    lastEnergyReset: Date;
    lastLoginDate: Date;
    loginStreak: number;
    totalPlayTime: number;
    referralCode: string;
    referredBy?: string;
    achievements: string[];
    seasonPassLevel: number;
    transactions: Array<{
        txHash: string;
        type: 'deposit' | 'withdraw' | 'convert';
        tokenType: 'AETH' | 'RON';
        amount: string;
        fee: string;
        status: 'pending' | 'confirmed' | 'failed';
        timestamp: Date;
        blockNumber?: number;
        verified: boolean;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.model.d.ts.map