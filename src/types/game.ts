// Game Type Definitions

export interface Character {
  _id: string;
  walletAddress: string;
  name: string;
  class: 'Warrior' | 'Mage' | 'Ranger' | 'Assassin' | 'Paladin';
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  str: number;
  agi: number;
  int: number;
  luk: number;
  vit: number;
  tokenId?: number;
  equipment: {
    weapon?: Item;
    armor?: Item;
    accessory?: Item;
  };
  skills: Skill[];
  inventory: Item[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  _id: string;
  name: string;
  type: 'Weapon' | 'Armor' | 'Accessory' | 'Consumable' | 'Material' | 'Quest';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  level: number;
  stats?: {
    str?: number;
    agi?: number;
    int?: number;
    luk?: number;
    vit?: number;
    hp?: number;
    mp?: number;
  };
  effects?: {
    type: string;
    value: number;
    duration?: number;
  }[];
  price: {
    gold?: number;
    premium?: number;
  };
  stackable: boolean;
  maxStack: number;
  description: string;
  imageUrl?: string;
}

export interface Skill {
  name: string;
  type: 'Active' | 'Passive';
  level: number;
  maxLevel: number;
  description: string;
  mpCost?: number;
  cooldown?: number;
  effects: {
    type: string;
    value: number;
  }[];
}

export interface User {
  walletAddress: string;
  username: string;
  gold: number;
  premium: number;
  tokens: number;
  level: number;
  exp: number;
  loginStreak: number;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface Quest {
  _id: string;
  title: string;
  description: string;
  type: 'Main' | 'Side' | 'Daily' | 'Weekly' | 'Event';
  requirements: {
    level?: number;
    questsCompleted?: string[];
  };
  objectives: {
    type: string;
    target: string;
    current: number;
    required: number;
  }[];
  rewards: {
    exp?: number;
    gold?: number;
    premium?: number;
    items?: Item[];
  };
  status: 'Available' | 'In Progress' | 'Completed';
  expiresAt?: Date;
}

export interface Dungeon {
  _id: string;
  name: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Hell';
  minLevel: number;
  maxLevel: number;
  energyCost: number;
  floors: number;
  rewards: {
    gold: { min: number; max: number };
    exp: { min: number; max: number };
    items: {
      itemType: string;
      rarity: string;
      dropRate: number;
    }[];
  };
  events: DungeonEvent[];
  bosses: DungeonBoss[];
  isActive: boolean;
}

export interface DungeonEvent {
  type: 'Combat' | 'Treasure' | 'Trap' | 'Puzzle' | 'Merchant';
  description: string;
  probability: number;
  effects: {
    hp?: number;
    gold?: number;
    item?: Item;
    damage?: number;
  };
}

export interface DungeonBoss {
  name: string;
  hp: number;
  str: number;
  agi: number;
  int: number;
  rewards: {
    gold: number;
    exp: number;
    items: Item[];
  };
}

export interface Guild {
  _id: string;
  name: string;
  tag: string;
  level: number;
  exp: number;
  leader: string;
  members: {
    walletAddress: string;
    role: 'Leader' | 'Officer' | 'Member';
    joinedAt: Date;
    contribution: number;
  }[];
  maxMembers: number;
  bonuses: {
    expBonus: number;
    goldBonus: number;
    dropRateBonus: number;
  };
  description: string;
  createdAt: Date;
}

export interface CombatResult {
  winner: 'attacker' | 'defender';
  damage: number;
  attackerPower: number;
  defenderPower: number;
  rewards?: {
    exp: number;
    gold: number;
    items?: Item[];
  };
}
