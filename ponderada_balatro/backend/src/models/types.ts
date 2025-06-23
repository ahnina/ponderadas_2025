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

export interface PlayHandRequest {
  cards: Card[];
}

export interface PlayHandResponse {
  score: number;
  money: number;
}

export interface PurchaseRequest {
  modifierId: string;
  type: 'joker' | 'planet' | 'tarot';
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
} 