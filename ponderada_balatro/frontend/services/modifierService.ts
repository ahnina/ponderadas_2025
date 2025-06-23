import { Card, ModifierEffect, ActiveModifier, Joker, Planet, Tarot } from '../types/game';

export class ModifierService {
  private static activeModifiers: ActiveModifier[] = [];

  // Converter modificador para efeito ativo
  static convertToActiveModifier(modifier: Joker | Planet | Tarot, type: 'joker' | 'planet' | 'tarot'): ActiveModifier {
    const effect = this.parseModifierEffect(modifier.effect, type);
    
    return {
      id: modifier.id,
      name: modifier.name,
      type,
      effect,
      isActive: true
    };
  }

  // Adicionar modificador ativo
  static addActiveModifier(modifier: Joker | Planet | Tarot, type: 'joker' | 'planet' | 'tarot'): void {
    const activeModifier = this.convertToActiveModifier(modifier, type);
    this.activeModifiers.push(activeModifier);
  }

  // Remover modificador ativo
  static removeActiveModifier(modifierId: string): void {
    this.activeModifiers = this.activeModifiers.filter(m => m.id !== modifierId);
  }

  // Obter todos os modificadores ativos
  static getActiveModifiers(): ActiveModifier[] {
    return this.activeModifiers;
  }

  // Aplicar efeitos aos valores das cartas
  static applyModifiersToCards(cards: Card[]): Card[] {
    const activeModifiers = this.getActiveModifiers();
    
    if (activeModifiers.length === 0) {
      return cards;
    }
    
    console.log('Applying modifiers to cards:', activeModifiers.map(m => `${m.name} (${m.effect.type})`));
    
    return cards.map(card => {
      let modifiedValue = card.value;
      const originalValue = card.value;
      
      // Aplicar transformações primeiro (elas mudam o valor base)
      const transforms = activeModifiers.filter(m => m.effect.type === 'transform');
      for (const transform of transforms) {
        if (this.shouldApplyEffect(card, transform.effect)) {
          modifiedValue = transform.effect.value;
          console.log(`Transform applied to ${card.rank}${card.suit}: ${originalValue} → ${modifiedValue} (${transform.name})`);
        }
      }
      
      // Aplicar multiplicadores
      const multipliers = activeModifiers.filter(m => m.effect.type === 'multiplier');
      for (const multiplier of multipliers) {
        if (this.shouldApplyEffect(card, multiplier.effect)) {
          const before = modifiedValue;
          modifiedValue *= multiplier.effect.value;
          console.log(`Multiplier applied to ${card.rank}${card.suit}: ${before} → ${modifiedValue} (${multiplier.name} x${multiplier.effect.value})`);
        }
      }

      // Aplicar bônus
      const bonuses = activeModifiers.filter(m => m.effect.type === 'bonus');
      for (const bonus of bonuses) {
        if (this.shouldApplyEffect(card, bonus.effect)) {
          const before = modifiedValue;
          modifiedValue += bonus.effect.value;
          console.log(`Bonus applied to ${card.rank}${card.suit}: ${before} → ${modifiedValue} (${bonus.name} +${bonus.effect.value})`);
        }
      }

      const finalValue = Math.floor(modifiedValue);
      if (finalValue !== originalValue) {
        console.log(`Final value for ${card.rank}${card.suit}: ${originalValue} → ${finalValue}`);
      }

      return {
        ...card,
        value: finalValue
      };
    });
  }

  // Calcular multiplicador de pontuação
  static calculateScoreMultiplier(): number {
    let multiplier = 1.0;
    
    const scoreMultipliers = this.activeModifiers.filter(m => 
      m.effect.type === 'multiplier' && m.effect.target === 'all'
    );
    
    for (const mod of scoreMultipliers) {
      multiplier *= mod.effect.value;
    }
    
    return multiplier;
  }

  // Verificar se deve aplicar efeito à carta
  private static shouldApplyEffect(card: Card, effect: ModifierEffect): boolean {
    if (!effect.target || effect.target === 'all') return true;
    
    switch (effect.target) {
      case 'hearts':
        return card.suit === 'hearts';
      case 'diamonds':
        return card.suit === 'diamonds';
      case 'clubs':
        return card.suit === 'clubs';
      case 'spades':
        return card.suit === 'spades';
      case 'face':
        return card.rank === 'J' || card.rank === 'Q' || card.rank === 'K';
      case 'ace':
        return card.rank === 'A';
      default:
        return true;
    }
  }

  // Converter descrição do efeito para ModifierEffect
  private static parseModifierEffect(effectDescription: string, type: 'joker' | 'planet' | 'tarot'): ModifierEffect {
    const description = effectDescription.toLowerCase();
    
    // Multiplicadores de pontuação geral
    if (description.includes('multiplies score by') || description.includes('multiplies by')) {
      const match = description.match(/(\d+(?:\.\d+)?)x/);
      const value = match ? parseFloat(match[1]) : 2.0;
      return {
        type: 'multiplier',
        value,
        target: 'all',
        description: effectDescription
      };
    }
    
    // Multiplicadores por naipe
    if (description.includes('hearts worth double') || description.includes('hearts worth triple')) {
      const value = description.includes('triple') ? 3.0 : 2.0;
      return {
        type: 'multiplier',
        value,
        target: 'hearts',
        description: effectDescription
      };
    }
    
    if (description.includes('diamonds worth double') || description.includes('diamonds worth triple')) {
      const value = description.includes('triple') ? 3.0 : 2.0;
      return {
        type: 'multiplier',
        value,
        target: 'diamonds',
        description: effectDescription
      };
    }
    
    if (description.includes('clubs worth double') || description.includes('clubs worth triple')) {
      const value = description.includes('triple') ? 3.0 : 2.0;
      return {
        type: 'multiplier',
        value,
        target: 'clubs',
        description: effectDescription
      };
    }
    
    if (description.includes('spades worth double') || description.includes('spades worth triple')) {
      const value = description.includes('triple') ? 3.0 : 2.0;
      return {
        type: 'multiplier',
        value,
        target: 'spades',
        description: effectDescription
      };
    }
    
    // Multiplicadores para figuras
    if (description.includes('face cards worth double') || description.includes('face cards worth triple') || 
        description.includes('figures worth double') || description.includes('figures worth triple')) {
      const value = description.includes('triple') ? 3.0 : 2.0;
      return {
        type: 'multiplier',
        value,
        target: 'face',
        description: effectDescription
      };
    }
    
    // Bônus aditivos
    if (description.includes('adds +') || description.includes('+')) {
      const match = description.match(/\+(\d+)/);
      const value = match ? parseInt(match[1]) : 2;
      return {
        type: 'bonus',
        value,
        target: 'all',
        description: effectDescription
      };
    }
    
    // Ás com valor específico
    if (description.includes('aces worth')) {
      const match = description.match(/(\d+) points/);
      const newValue = match ? parseInt(match[1]) : 15;
      const bonus = newValue - 11; // Ás base = 11
      return {
        type: 'bonus',
        value: bonus,
        target: 'ace',
        description: effectDescription
      };
    }
    
    // Efeitos especiais do Tarot
    if (description.includes('transforms all cards to aces')) {
      return {
        type: 'transform',
        value: 11, // Valor do ás
        target: 'all',
        description: effectDescription
      };
    }
    
    if (description.includes('doubles all card values')) {
      return {
        type: 'multiplier',
        value: 2.0,
        target: 'all',
        description: effectDescription
      };
    }
    
    if (description.includes('all face cards become aces')) {
      return {
        type: 'transform',
        value: 11, // Valor do ás
        target: 'face',
        description: effectDescription
      };
    }
    
    // Efeitos especiais
    return {
      type: 'special',
      value: 1.0,
      target: 'all',
      description: effectDescription
    };
  }

  // Limpar todos os modificadores (para novo jogo)
  static clearAllModifiers(): void {
    this.activeModifiers = [];
  }
} 