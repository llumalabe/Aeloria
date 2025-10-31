import mongoose, { Document } from 'mongoose';
export interface IQuest extends Document {
    title: string;
    description: string;
    questType: 'Daily' | 'Weekly' | 'Story' | 'Event' | 'Achievement';
    requirements: Array<{
        type: string;
        target: number;
        current?: number;
    }>;
    rewards: {
        gold?: number;
        premium?: number;
        tokens?: number;
        exp?: number;
        items?: string[];
    };
    minLevel: number;
    isRepeatable: boolean;
    expiresAt?: Date;
    isActive: boolean;
}
declare const _default: mongoose.Model<IQuest, {}, {}, {}, mongoose.Document<unknown, {}, IQuest, {}, {}> & IQuest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Quest.model.d.ts.map