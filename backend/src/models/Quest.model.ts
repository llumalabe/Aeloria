import mongoose, { Schema, Document } from 'mongoose';

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

const QuestSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    questType: {
      type: String,
      enum: ['Daily', 'Weekly', 'Story', 'Event', 'Achievement'],
      required: true,
    },
    requirements: [{
      type: {
        type: String,
        required: true,
      },
      target: {
        type: Number,
        required: true,
      },
      current: {
        type: Number,
        default: 0,
      },
    }],
    rewards: {
      gold: Number,
      premium: Number,
      tokens: Number,
      exp: Number,
      items: [String],
    },
    minLevel: {
      type: Number,
      default: 1,
    },
    isRepeatable: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuest>('Quest', QuestSchema);
