import mongoose, { Schema, Document } from 'mongoose';

export interface ISurvivorNFT extends Document {
  tokenId: number;
  ownerAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  class: 'Soldier' | 'Medic' | 'Engineer' | 'Scout';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  level: number;
  exp: number;
  stats: {
    hp: number;
    maxHp: number;
    strength: number;
    agility: number;
    intelligence: number;
    luck: number;
    vitality: number;
  };
  skills: string[];
  equipment: {
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
  survivedDays: number;
  zombiesKilled: number;
  createdAt: Date;
  updatedAt: Date;
}

const SurvivorNFTSchema: Schema = new Schema(
  {
    tokenId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    ownerAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: 'A survivor in the zombie apocalypse',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      enum: ['Soldier', 'Medic', 'Engineer', 'Scout'],
      required: true,
    },
    rarity: {
      type: String,
      enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
      default: 'Common',
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
    stats: {
      hp: { type: Number, default: 100 },
      maxHp: { type: Number, default: 100 },
      strength: { type: Number, default: 10 },
      agility: { type: Number, default: 10 },
      intelligence: { type: Number, default: 10 },
      luck: { type: Number, default: 10 },
      vitality: { type: Number, default: 10 },
    },
    skills: {
      type: [String],
      default: [],
    },
    equipment: {
      weapon: { type: String, default: null },
      armor: { type: String, default: null },
      accessory: { type: String, default: null },
    },
    survivedDays: {
      type: Number,
      default: 0,
    },
    zombiesKilled: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
SurvivorNFTSchema.index({ ownerAddress: 1, tokenId: 1 });

export default mongoose.model<ISurvivorNFT>('SurvivorNFT', SurvivorNFTSchema);
