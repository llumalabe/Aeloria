import mongoose, { Schema, Document } from 'mongoose';

// Equipment Type Enum
export enum EquipmentType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESSORY = 'accessory',
}

// Equipment Rarity Enum
export enum EquipmentRarity {
  COMMON = 0,
  UNCOMMON = 1,
  RARE = 2,
  EPIC = 3,
  LEGENDARY = 4,
}

// Equipment Stats Interface
interface EquipmentStats {
  str?: number;
  agi?: number;
  int?: number;
  luk?: number;
  vit?: number;
  hp?: number;
  critRate?: number; // Critical hit rate (%)
  critDmg?: number; // Critical damage multiplier (%)
  dodge?: number; // Dodge rate (%)
}

// Equipment Interface
export interface IEquipment extends Document {
  walletAddress: string;
  itemName: string;
  itemType: EquipmentType;
  rarity: EquipmentRarity;
  level: number;
  
  // Stats bonuses
  stats: EquipmentStats;
  
  // Special abilities
  specialAbility?: {
    name: string;
    description: string;
    effect: string;
  };
  
  // NFT Data
  isNFT: boolean;
  tokenId?: number;
  
  // Equipment status
  isEquipped: boolean;
  equippedToCharacterId?: string; // Reference to Character._id
  
  // Metadata
  imageUrl?: string;
  description?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    itemName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    itemType: {
      type: String,
      enum: ['weapon', 'armor', 'accessory'],
      required: true,
    },
    rarity: {
      type: Number,
      enum: [0, 1, 2, 3, 4], // COMMON, UNCOMMON, RARE, EPIC, LEGENDARY
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },
    
    // Stats
    stats: {
      str: { type: Number, default: 0, min: 0 },
      agi: { type: Number, default: 0, min: 0 },
      int: { type: Number, default: 0, min: 0 },
      luk: { type: Number, default: 0, min: 0 },
      vit: { type: Number, default: 0, min: 0 },
      hp: { type: Number, default: 0, min: 0 },
      critRate: { type: Number, default: 0, min: 0, max: 100 },
      critDmg: { type: Number, default: 0, min: 0 },
      dodge: { type: Number, default: 0, min: 0, max: 100 },
    },
    
    // Special Ability
    specialAbility: {
      name: { type: String },
      description: { type: String },
      effect: { type: String },
    },
    
    // NFT Status
    isNFT: {
      type: Boolean,
      default: false,
    },
    tokenId: {
      type: Number,
      sparse: true, // Allows null but ensures uniqueness when present
    },
    
    // Equipment Status
    isEquipped: {
      type: Boolean,
      default: false,
    },
    equippedToCharacterId: {
      type: String, // Character._id
    },
    
    // Metadata
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
EquipmentSchema.index({ walletAddress: 1, isEquipped: 1 });
EquipmentSchema.index({ tokenId: 1 }, { unique: true, sparse: true });
EquipmentSchema.index({ equippedToCharacterId: 1 });

export default mongoose.model<IEquipment>('Equipment', EquipmentSchema);
