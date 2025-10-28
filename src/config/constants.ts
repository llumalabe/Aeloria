export const CONTRACT_ADDRESSES = {
  CHARACTER: process.env.NEXT_PUBLIC_CHARACTER_CONTRACT || '',
  ITEM: process.env.NEXT_PUBLIC_ITEM_CONTRACT || '',
  TOKEN: process.env.NEXT_PUBLIC_TOKEN_CONTRACT || '',
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '',
};

export const RONIN_CHAIN_ID = Number(process.env.NEXT_PUBLIC_RONIN_CHAIN_ID) || 2021;
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const CHARACTER_CLASSES = [
  { id: 0, name: 'Warrior', icon: '⚔️', description: 'Master of melee combat' },
  { id: 1, name: 'Mage', icon: '🔮', description: 'Wielder of arcane magic' },
  { id: 2, name: 'Archer', icon: '🏹', description: 'Precision striker' },
  { id: 3, name: 'Rogue', icon: '🗡️', description: 'Shadow assassin' },
  { id: 4, name: 'Cleric', icon: '✨', description: 'Holy healer' },
  { id: 5, name: 'Paladin', icon: '🛡️', description: 'Divine knight' },
];

export const RARITY_COLORS = {
  0: '#FFFFFF', // Common
  1: '#00FF00', // Uncommon
  2: '#0080FF', // Rare
  3: '#9D00FF', // Epic
  4: '#FF8000', // Legendary
  5: '#FF00FF', // Mythic
};

export const RARITY_NAMES = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
  'Mythic',
];
