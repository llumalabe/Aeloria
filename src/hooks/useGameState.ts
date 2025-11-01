import { create } from 'zustand';
import type { User, Character, Item } from '@/types/game';

interface GameState {
  user: User | null;
  selectedCharacter: Character | null;
  characters: Character[];
  items: Item[];
  setUser: (user: User | null) => void;
  setSelectedCharacter: (character: Character | null) => void;
  setCharacters: (characters: Character[]) => void;
  setItems: (items: Item[]) => void;
  updateCurrency: (gold?: number, premium?: number, tokens?: number) => void;
}

export const useGameState = create<GameState>((set) => ({
  user: null,
  selectedCharacter: null,
  characters: [],
  items: [],

  setUser: (user) => set({ user }),
  
  setSelectedCharacter: (character) => set({ selectedCharacter: character }),
  
  setCharacters: (characters) => set({ characters }),
  
  setItems: (items) => set({ items }),
  
  updateCurrency: (gold = 0, premium = 0, tokens = 0) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            gold: state.user.gold + gold,
            premium: state.user.premium + premium,
            tokens: state.user.tokens + tokens,
          }
        : null,
    })),
}));
