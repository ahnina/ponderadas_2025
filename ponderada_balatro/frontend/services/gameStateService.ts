import { apiService } from './api';

class GameStateService {
  private static money: number = 4;
  private static listeners: ((money: number) => void)[] = [];

  static getMoney(): number {
    return this.money;
  }

  static setMoney(newMoney: number): void {
    this.money = newMoney;
    this.notifyListeners();
  }

  static addMoney(amount: number): void {
    this.money += amount;
    this.notifyListeners();
  }

  static subtractMoney(amount: number): void {
    this.money -= amount;
    this.notifyListeners();
  }

  static async syncMoneyFromServer(): Promise<void> {
    try {
      const serverMoney = await apiService.getPlayerMoney();
      this.setMoney(serverMoney);
    } catch (error) {
      console.error('Failed to sync money from server:', error);
    }
  }

  static addListener(listener: (money: number) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.money));
  }
}

export { GameStateService }; 