import { create } from 'zustand';

interface User {
  walletAddress: string;
  username: string;
  gold: number;
  premium: number;
  tokens: number;
  level: number;
  exp: number;
  loginStreak: number;
}

interface GameState {
  user: User | null;
  selectedCharacter: any | null;
  characters: any[];
  items: any[];
  setUser: (user: User | null) => void;
  setSelectedCharacter: (character: any) => void;
  setCharacters: (characters: any[]) => void;
  setItems: (items: any[]) => void;
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
