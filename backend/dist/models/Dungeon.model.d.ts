import mongoose, { Document } from 'mongoose';
export interface IDungeon extends Document {
    name: string;
    difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Hell';
    minLevel: number;
    maxLevel: number;
    energyCost: number;
    floors: number;
    rewards: {
        gold: {
            min: number;
            max: number;
        };
        exp: {
            min: number;
            max: number;
        };
        items: Array<{
            itemType: string;
            rarity: string;
            dropRate: number;
        }>;
    };
    events: Array<{
        type: string;
        description: string;
        probability: number;
        effects: any;
    }>;
    bosses: Array<{
        name: string;
        hp: number;
        str: number;
        agi: number;
        int: number;
        rewards: any;
    }>;
    isActive: boolean;
}
declare const _default: mongoose.Model<IDungeon, {}, {}, {}, mongoose.Document<unknown, {}, IDungeon, {}, {}> & IDungeon & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Dungeon.model.d.ts.map