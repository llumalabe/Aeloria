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

// Rarity Enum
export enum Rarity {
  COMMON = 0,
  UNCOMMON = 1,
  RARE = 2,
  EPIC = 3,
  LEGENDARY = 4,
}

// Passive Skill Interface
interface PassiveSkill {
  name: string;
  description: string;
  effect: string; // e.g., "+10% STR", "Regen 5% HP per turn"
}

// Equipment Slot Interface
interface EquipmentSlot {
  itemId?: string; // Reference to Equipment._id
  itemName?: string;
  itemType?: string; // 'weapon', 'armor', 'accessory'
  stats?: {
    str?: number;
    agi?: number;
    int?: number;
    luk?: number;
    vit?: number;
    hp?: number;
  };
}

export interface ICharacter extends Document {
  walletAddress: string;
  characterName: string;
  characterClass: CharacterClass;
  rarity: Rarity;
  level: number;
  exp: number;
  expRequired: number;
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  int: number;
  luk: number;
  vit: number;

  // Passive Skills (class-based)
  passiveSkills: PassiveSkill[];
  
  // Equipment (5 slots)
  equipment: {
    weapon?: EquipmentSlot;
    armor?: EquipmentSlot;
    accessory1?: EquipmentSlot;
    accessory2?: EquipmentSlot;
    accessory3?: EquipmentSlot;
  };

  // NFT data (null for starter character)
  tokenId?: number;
  isNFT: boolean;
  isBoundToAccount: boolean; // True = in-game, False = can trade

  // Legacy equipment fields (deprecated - use equipment object)
  equippedWeapon?: number; // Item tokenId
  equippedArmor?: number;
  equippedAccessory?: number;

  imageUrl?: string;
  lastAdventureTime: Date;
  createdAt: Date;
  updatedAt: Date;
}const CharacterSchema: Schema = new Schema(
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
      minlength: 1,
      maxlength: 30,
    },
    characterClass: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3, 4, 5], // Warrior, Mage, Archer, Rogue, Cleric, Paladin
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
    exp: {
      type: Number,
      default: 0,
      min: 0,
    },
    expRequired: {
      type: Number,
      default: 100,
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
    
    // Passive Skills
    passiveSkills: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        effect: { type: String, required: true },
      },
    ],
    
    // Equipment Slots (new system)
    equipment: {
      weapon: {
        itemId: { type: String },
        itemName: { type: String },
        itemType: { type: String },
        stats: {
          str: { type: Number, default: 0 },
          agi: { type: Number, default: 0 },
          int: { type: Number, default: 0 },
          luk: { type: Number, default: 0 },
          vit: { type: Number, default: 0 },
          hp: { type: Number, default: 0 },
        },
      },
      armor: {
        itemId: { type: String },
        itemName: { type: String },
        itemType: { type: String },
        stats: {
          str: { type: Number, default: 0 },
          agi: { type: Number, default: 0 },
          int: { type: Number, default: 0 },
          luk: { type: Number, default: 0 },
          vit: { type: Number, default: 0 },
          hp: { type: Number, default: 0 },
        },
      },
      accessory1: {
        itemId: { type: String },
        itemName: { type: String },
        itemType: { type: String },
        stats: {
          str: { type: Number, default: 0 },
          agi: { type: Number, default: 0 },
          int: { type: Number, default: 0 },
          luk: { type: Number, default: 0 },
          vit: { type: Number, default: 0 },
          hp: { type: Number, default: 0 },
        },
      },
      accessory2: {
        itemId: { type: String },
        itemName: { type: String },
        itemType: { type: String },
        stats: {
          str: { type: Number, default: 0 },
          agi: { type: Number, default: 0 },
          int: { type: Number, default: 0 },
          luk: { type: Number, default: 0 },
          vit: { type: Number, default: 0 },
          hp: { type: Number, default: 0 },
        },
      },
      accessory3: {
        itemId: { type: String },
        itemName: { type: String },
        itemType: { type: String },
        stats: {
          str: { type: Number, default: 0 },
          agi: { type: Number, default: 0 },
          int: { type: Number, default: 0 },
          luk: { type: Number, default: 0 },
          vit: { type: Number, default: 0 },
          hp: { type: Number, default: 0 },
        },
      },
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
    
    // Legacy equipment (deprecated)
    equippedWeapon: {
      type: Number,
    },
    equippedArmor: {
      type: Number,
    },
    equippedAccessory: {
      type: Number,
    },
    
    imageUrl: {
      type: String,
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
CharacterSchema.index({ tokenId: 1 }, { unique: true, sparse: true });

// Calculate EXP required for next level
CharacterSchema.pre('save', function (next) {
  if (this.isModified('level')) {
    this.expRequired = Math.floor(100 * Math.pow(this.level, 1.5));
  }
  next();
});

// Virtual: Get total stats (base + equipment)
CharacterSchema.virtual('totalStats').get(function () {
  const base = {
    str: this.str,
    agi: this.agi,
    int: this.int,
    luk: this.luk,
    vit: this.vit,
    hp: this.maxHp,
  };

  const equipment = this.equipment;
  if (!equipment) return base;

  const slots = ['weapon', 'armor', 'accessory1', 'accessory2', 'accessory3'];

  slots.forEach((slot) => {
    const item = equipment[slot as keyof typeof equipment];
    if (item && item.stats) {
      base.str += item.stats.str || 0;
      base.agi += item.stats.agi || 0;
      base.int += item.stats.int || 0;
      base.luk += item.stats.luk || 0;
      base.vit += item.stats.vit || 0;
      base.hp += item.stats.hp || 0;
    }
  });

  return base;
});

export default mongoose.model<ICharacter>('Character', CharacterSchema);
