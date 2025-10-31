import mongoose, { Document } from 'mongoose';
export interface IGuild extends Document {
    name: string;
    description: string;
    leaderWallet: string;
    members: Array<{
        walletAddress: string;
        role: 'Leader' | 'Officer' | 'Member';
        joinedAt: Date;
    }>;
    level: number;
    exp: number;
    maxMembers: number;
    guildHall: {
        level: number;
        bonuses: any;
    };
    treasury: {
        gold: number;
        premium: number;
    };
    isRecruiting: boolean;
    requirements: {
        minLevel: number;
    };
    createdAt: Date;
}
declare const _default: mongoose.Model<IGuild, {}, {}, {}, mongoose.Document<unknown, {}, IGuild, {}, {}> & IGuild & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Guild.model.d.ts.map