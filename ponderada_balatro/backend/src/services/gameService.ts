import { faker } from '@faker-js/faker';
import { Card, Joker, Planet, Tarot, GameState } from '../models/types';

export class GameService {
  private static gameState: GameState = {
    currentHand: [],
    deck: [],
    discardPile: [],
    modifiers: [],
    score: 0,
    money: 4,
    round: 1,
    handSize: 5
  };

  private static availableJokers: Joker[] = [];
  private static availablePlanets: Planet[] = [];
  private static availableTarot: Tarot[] = [];

  static initializeGame(): GameState {
    // Gerar deck inicial
    this.gameState.deck = this.generateDeck();
    
    // Embaralhar deck
    this.shuffleDeck();
    
    // Distribuir mão inicial
    this.gameState.currentHand = this.gameState.deck.splice(0, this.gameState.handSize);
    
    // Gerar itens da loja
    this.generateShopItems();
    
    return { ...this.gameState };
  }

  static getInitialGameState(): GameState {
    if (this.gameState.deck.length === 0) {
      return this.initializeGame();
    }
    return { ...this.gameState };
  }

  static playHand(selectedCards: Card[]): { score: number; money: number } {
    // Calcular pontuação base
    let score = selectedCards.reduce((total, card) => total + card.value, 0);
    
    // Bônus por quantidade de cartas
    if (selectedCards.length >= 3) {
      score += Math.floor(score * 0.5); // +50% bônus para 3+ cartas
    }
    
    // Bônus por sequência
    const sortedCards = [...selectedCards].sort((a, b) => a.value - b.value);
    let sequenceBonus = 0;
    for (let i = 0; i < sortedCards.length - 1; i++) {
      if (sortedCards[i + 1].value === sortedCards[i].value + 1) {
        sequenceBonus += 10;
      }
    }
    score += sequenceBonus;
    
    // Converter pontuação em dinheiro (1 ponto = 0.1 dinheiro)
    const money = Math.floor(score / 10);
    
    // Atualizar estado do jogo
    this.gameState.score += score;
    this.gameState.money += money;
    
    // Remover cartas jogadas da mão
    this.gameState.currentHand = this.gameState.currentHand.filter(
      card => !selectedCards.find(selected => selected.id === card.id)
    );
    
    // Adicionar ao descarte
    this.gameState.discardPile.push(...selectedCards);
    
    return { score, money };
  }

  static drawCards(count: number): Card[] {
    const cardsToDraw = Math.min(count, this.gameState.deck.length);
    const drawnCards = this.gameState.deck.splice(0, cardsToDraw);
    
    // Adicionar à mão atual
    this.gameState.currentHand.push(...drawnCards);
    
    return drawnCards;
  }

  static discardCards(selectedCards: Card[]): void {
    // Remover cartas selecionadas da mão
    this.gameState.currentHand = this.gameState.currentHand.filter(
      card => !selectedCards.find(selected => selected.id === card.id)
    );
    
    // Adicionar ao descarte
    this.gameState.discardPile.push(...selectedCards);
  }

  static getAvailableJokers(): Joker[] {
    return this.availableJokers;
  }

  static getAvailablePlanets(): Planet[] {
    return this.availablePlanets;
  }

  static getAvailableTarot(): Tarot[] {
    return this.availableTarot;
  }

  static purchaseModifier(modifierId: string, type: 'joker' | 'planet' | 'tarot'): boolean {
    let modifier: Joker | Planet | Tarot | undefined;
    let cost = 0;
    
    // Encontrar o modificador e definir custo
    switch (type) {
      case 'joker':
        modifier = this.availableJokers.find(j => j.id === modifierId);
        if (modifier && 'cost' in modifier) {
          cost = modifier.cost;
        }
        break;
      case 'planet':
        modifier = this.availablePlanets.find(p => p.id === modifierId);
        cost = 3; // Planetas custam 3
        break;
      case 'tarot':
        modifier = this.availableTarot.find(t => t.id === modifierId);
        cost = 2; // Tarot custa 2
        break;
    }
    
    if (!modifier) {
      return false;
    }
    
    // Verificar se tem dinheiro suficiente
    if (this.gameState.money < cost) {
      return false;
    }
    
    // Descontar dinheiro
    this.gameState.money -= cost;
    
    // Adicionar ao inventário do jogador
    this.gameState.modifiers.push({
      id: modifier.id,
      type,
      data: modifier
    });
    
    // Remover da loja
    switch (type) {
      case 'joker':
        this.availableJokers = this.availableJokers.filter(j => j.id !== modifierId);
        break;
      case 'planet':
        this.availablePlanets = this.availablePlanets.filter(p => p.id !== modifierId);
        break;
      case 'tarot':
        this.availableTarot = this.availableTarot.filter(t => t.id !== modifierId);
        break;
    }
    
    return true;
  }

  static getPlayerMoney(): number {
    return this.gameState.money;
  }

  private static generateDeck(): Card[] {
    const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Array<'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'> = 
      ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const deck: Card[] = [];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          id: faker.string.uuid(),
          suit,
          rank,
          value: this.getCardValue(rank)
        });
      }
    }
    
    return deck;
  }

  private static getCardValue(rank: string): number {
    switch (rank) {
      case 'A': return 11;
      case 'K': return 10;
      case 'Q': return 10;
      case 'J': return 10;
      default: return parseInt(rank);
    }
  }

  private static shuffleDeck(): void {
    for (let i = this.gameState.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.gameState.deck[i], this.gameState.deck[j]] = [this.gameState.deck[j], this.gameState.deck[i]];
    }
  }

  private static generateShopItems(): void {
    // Gerar Jokers
    this.availableJokers = Array.from({ length: 6 }, () => ({
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        'Joker', 'Clown', 'Fool', 'Trickster', 'Wild Card', 'Chaos Card',
        'Lucky Card', 'Fortune Card', 'Mystery Card', 'Power Card'
      ]),
      description: faker.lorem.sentence(),
      effect: faker.helpers.arrayElement([
        'Multiplies score by 2x',
        'Hearts worth double points',
        'Diamonds worth double points',
        'Clubs worth double points',
        'Spades worth double points',
        'Face cards worth double points',
        'Adds +5 to all cards',
        'Aces worth 15 points',
        'Multiplies score by 1.5x',
        'Adds +3 to all cards'
      ]),
      rarity: faker.helpers.arrayElement(['common', 'uncommon', 'rare', 'legendary']),
      cost: faker.helpers.arrayElement([2, 3, 4, 5]),
      isActive: false
    }));

    // Gerar Planetas
    this.availablePlanets = Array.from({ length: 4 }, () => ({
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        'Mars', 'Venus', 'Jupiter', 'Saturn', 'Mercury', 'Neptune',
        'Uranus', 'Pluto', 'Earth', 'Moon'
      ]),
      description: faker.lorem.sentence(),
      effect: faker.helpers.arrayElement([
        'Multiplies score by 2x',
        'Multiplies score by 1.5x',
        'Multiplies score by 3x',
        'Hearts worth triple points',
        'Face cards worth triple points',
        'Aces worth 20 points'
      ]),
      multiplier: faker.helpers.arrayElement([1.5, 2, 2.5, 3]),
      isActive: false
    }));

    // Gerar Tarot
    this.availableTarot = Array.from({ length: 4 }, () => ({
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
        'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
        'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice'
      ]),
      description: faker.lorem.sentence(),
      effect: faker.helpers.arrayElement([
        'Transforms all cards to aces',
        'Doubles all card values',
        'Adds +7 to all cards',
        'Multiplies score by 2.5x',
        'All face cards become aces',
        'All aces worth 20 points'
      ]),
      isActive: false
    }));
  }
} 