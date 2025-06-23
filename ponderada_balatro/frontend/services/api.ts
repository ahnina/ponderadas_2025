import { Card, Joker, Planet, Tarot, GameState } from '../types/game';

const API_BASE_URL = 'http://192.168.15.4:3001/api'; // Adicionado /api no final

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ status: string }>('/health');
      return response.status === 'OK';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getInitialGameState(): Promise<GameState> {
    return this.makeRequest<GameState>('/game/state');
  }

  async playHand(cards: Card[]): Promise<{ score: number; money: number }> {
    return this.makeRequest<{ score: number; money: number }>('/game/play-hand', {
      method: 'POST',
      body: JSON.stringify({ cards }),
    });
  }

  async drawCards(count: number): Promise<Card[]> {
    return this.makeRequest<Card[]>('/game/draw-cards', {
      method: 'POST',
      body: JSON.stringify({ count }),
    });
  }

  async discardCards(cards: Card[]): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>('/game/discard-cards', {
      method: 'POST',
      body: JSON.stringify({ cards }),
    });
  }

  async getAvailableJokers(): Promise<Joker[]> {
    return this.makeRequest<Joker[]>('/shop/jokers');
  }

  async getAvailablePlanets(): Promise<Planet[]> {
    return this.makeRequest<Planet[]>('/shop/planets');
  }

  async getAvailableTarot(): Promise<Tarot[]> {
    return this.makeRequest<Tarot[]>('/shop/tarot');
  }

  async purchaseModifier(modifierId: string, type: 'joker' | 'planet' | 'tarot'): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ success: boolean; playerMoney?: number }>('/shop/purchase', {
        method: 'POST',
        body: JSON.stringify({ modifierId, type }),
      });
      
      return response.success;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  }

  async getPlayerMoney(): Promise<number> {
    try {
      const response = await this.makeRequest<{ money: number }>('/player/money');
      return response.money;
    } catch (error) {
      console.error('Failed to get player money:', error);
      return 0;
    }
  }
}

export const apiService = new ApiService(); 