import mongoose, { Schema, Document } from 'mongoose';

// Dungeon Difficulty Enum
export enum DungeonDifficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  EXPERT = 'expert',
  NIGHTMARE = 'nightmare',
}

// Enemy Interface
interface Enemy {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  int: number;
  luk: number;
  vit: number;
  expReward: number;
  goldReward: number;
}

// Battle Log Interface
interface BattleLog {
  turn: number;
  attacker: string;
  action: string;
  damage: number;
  targetHp: number;
  message: string;
}

// Loot Reward Interface
interface LootReward {
  type: 'gold' | 'exp' | 'equipment' | 'item';
  itemName?: string;
  itemId?: string;
  amount?: number;
  rarity?: number;
}

// Dungeon Run Interface
export interface IDungeonRun extends Document {
  walletAddress: string;
  characterId: string;
  dungeonName: string;
  difficulty: DungeonDifficulty;
  
  status: 'in-progress' | 'completed' | 'failed';
  currentFloor: number;
  totalFloors: number;
  
  currentEnemy?: Enemy;
  playerCurrentHp: number;
  battleLog: BattleLog[];
  
  totalGold: number;
  totalExp: number;
  lootCollected: LootReward[];
  
  energyCost: number;
  
  characterSnapshot: {
    level: number;
    hp: number;
    maxHp: number;
    str: number;
    agi: number;
    int: number;
    luk: number;
    vit: number;
  };
  
  startedAt: Date;
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const DungeonRunSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    characterId: {
      type: String,
      required: true,
      index: true,
    },
    dungeonName: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'normal', 'hard', 'expert', 'nightmare'],
      required: true,
    },
    
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'failed'],
      default: 'in-progress',
    },
    currentFloor: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalFloors: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    
    currentEnemy: {
      name: { type: String },
      level: { type: Number },
      hp: { type: Number },
      maxHp: { type: Number },
      str: { type: Number },
      agi: { type: Number },
      int: { type: Number },
      luk: { type: Number },
      vit: { type: Number },
      expReward: { type: Number },
      goldReward: { type: Number },
    },
    
    playerCurrentHp: {
      type: Number,
      required: true,
    },
    
    battleLog: [{
      turn: { type: Number, required: true },
      attacker: { type: String, required: true },
      action: { type: String, required: true },
      damage: { type: Number, default: 0 },
      targetHp: { type: Number, required: true },
      message: { type: String, required: true },
    }],
    
    totalGold: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalExp: {
      type: Number,
      default: 0,
      min: 0,
    },
    lootCollected: [{
      type: { type: String, enum: ['gold', 'exp', 'equipment', 'item'], required: true },
      itemName: { type: String },
      itemId: { type: String },
      amount: { type: Number },
      rarity: { type: Number },
    }],
    
    energyCost: {
      type: Number,
      required: true,
      min: 1,
    },
    
    characterSnapshot: {
      level: { type: Number, required: true },
      hp: { type: Number, required: true },
      maxHp: { type: Number, required: true },
      str: { type: Number, required: true },
      agi: { type: Number, required: true },
      int: { type: Number, required: true },
      luk: { type: Number, required: true },
      vit: { type: Number, required: true },
    },
    
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

DungeonRunSchema.index({ walletAddress: 1, status: 1 });
DungeonRunSchema.index({ characterId: 1, createdAt: -1 });

export default mongoose.model<IDungeonRun>('DungeonRun', DungeonRunSchema);
