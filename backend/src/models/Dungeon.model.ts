import mongoose, { Schema, Document } from 'mongoose';

export interface IDungeon extends Document {
  name: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Hell';
  minLevel: number;
  maxLevel: number;
  energyCost: number;
  floors: number;
  rewards: {
    gold: { min: number; max: number };
    exp: { min: number; max: number };
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

const DungeonSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Normal', 'Hard', 'Expert', 'Hell'],
      required: true,
    },
    minLevel: {
      type: Number,
      required: true,
    },
    maxLevel: {
      type: Number,
      required: true,
    },
    energyCost: {
      type: Number,
      default: 10,
    },
    floors: {
      type: Number,
      default: 5,
    },
    rewards: {
      gold: {
        min: Number,
        max: Number,
      },
      exp: {
        min: Number,
        max: Number,
      },
      items: [{
        itemType: String,
        rarity: String,
        dropRate: Number,
      }],
    },
    events: [{
      type: String,
      description: String,
      probability: Number,
      effects: Schema.Types.Mixed,
    }],
    bosses: [{
      name: String,
      hp: Number,
      str: Number,
      agi: Number,
      int: Number,
      rewards: Schema.Types.Mixed,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDungeon>('Dungeon', DungeonSchema);
