import mongoose, { Schema, Document } from 'mongoose';

// Character classes enum
export enum CharacterClass {
  WARRIOR = 0,
  MAGE = 1,
  ARCHER = 2,
  ROGUE = 3,
  CLERIC = 4,
  PALADIN = 5
}

export interface ICharacter extends Document {
  walletAddress: string;
  characterName: string;
  characterClass: CharacterClass;
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  int: number;
  luk: number;
  vit: number;
  
  // NFT data (null for starter character)
  tokenId?: number;
  isNFT: boolean;
  isBoundToAccount: boolean; // True = in-game, False = can trade
  
  // Equipment slots
  equippedWeapon?: number; // Item tokenId
  equippedArmor?: number;
  equippedAccessory?: number;
  
  lastAdventureTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
CharacterSchema.index({ walletAddress: 1, isNFT: 1, isBoundToAccount: 1 });

export default mongoose.model<ICharacter>('Character', CharacterSchema);
