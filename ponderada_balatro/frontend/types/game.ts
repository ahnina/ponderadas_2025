export interface Card {
  id: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  value: number;
  isSelected?: boolean;
}

export interface Joker {
  id: string;
  name: string;
  description: string;
  effect: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  cost: number;
  isActive: boolean;
}

export interface Planet {
  id: string;
  name: string;
  description: string;
  effect: string;
  multiplier: number;
  isActive: boolean;
}

export interface Tarot {
  id: string;
  name: string;
  description: string;
  effect: string;
  isActive: boolean;
}

export interface Modifier {
  id: string;
  type: 'joker' | 'planet' | 'tarot';
  data: Joker | Planet | Tarot;
}

export interface GameState {
  currentHand: Card[];
  deck: Card[];
  discardPile: Card[];
  modifiers: Modifier[];
  score: number;
  money: number;
  round: number;
  handSize: number;
}

export interface GameSettings {
  difficulty: 'easy' | 'normal' | 'hard';
  startingMoney: number;
  maxHandSize: number;
  deckSize: number;
}

// Novos tipos para o sistema de modificadores
export interface ModifierEffect {
  type: 'multiplier' | 'bonus' | 'transform' | 'special';
  value: number;
  target?: 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'face' | 'ace' | 'all';
  description: string;
}

export interface ActiveModifier {
  id: string;
  name: string;
  type: 'joker' | 'planet' | 'tarot';
  effect: ModifierEffect;
  isActive: boolean;
} 