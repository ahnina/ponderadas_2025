import { Request, Response } from 'express';
import { GameService } from '../services/gameService';
import { PlayHandRequest, PurchaseRequest } from '../models/types';

export const getInitialGameState = (req: Request, res: Response) => {
  try {
    const gameState = GameService.getInitialGameState();
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game state' });
  }
};

export const playHand = (req: Request, res: Response) => {
  try {
    const { cards } = req.body;
    
    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Invalid cards data' });
    }
    
    const result = GameService.playHand(cards);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to play hand' });
  }
};

export const drawCards = (req: Request, res: Response) => {
  try {
    const { count } = req.body;
    
    if (!count || typeof count !== 'number' || count <= 0) {
      return res.status(400).json({ error: 'Invalid count' });
    }
    
    const cards = GameService.drawCards(count);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to draw cards' });
  }
};

export const discardCards = (req: Request, res: Response) => {
  try {
    const { cards } = req.body;
    
    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Invalid cards data' });
    }
    
    GameService.discardCards(cards);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to discard cards' });
  }
};

export const getAvailableJokers = (req: Request, res: Response) => {
  try {
    const jokers = GameService.getAvailableJokers();
    console.log('Sending jokers:', jokers.length, 'items');
    console.log('Joker IDs:', jokers.map(j => j.id));
    res.json(jokers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get jokers' });
  }
};

export const getAvailablePlanets = (req: Request, res: Response) => {
  try {
    const planets = GameService.getAvailablePlanets();
    console.log('Sending planets:', planets.length, 'items');
    console.log('Planet IDs:', planets.map(p => p.id));
    res.json(planets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get planets' });
  }
};

export const getAvailableTarot = (req: Request, res: Response) => {
  try {
    const tarot = GameService.getAvailableTarot();
    console.log('Sending tarot:', tarot.length, 'items');
    console.log('Tarot IDs:', tarot.map(t => t.id));
    res.json(tarot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tarot cards' });
  }
};

export const purchaseModifier = (req: Request, res: Response) => {
  try {
    const { modifierId, type } = req.body;
    
    console.log('Purchase request:', { modifierId, type });
    
    if (!modifierId || !type) {
      console.log('Missing parameters');
      return res.status(400).json({ error: 'Missing modifierId or type' });
    }
    
    if (!['joker', 'planet', 'tarot'].includes(type)) {
      console.log('Invalid type:', type);
      return res.status(400).json({ error: 'Invalid type' });
    }
    
    const success = GameService.purchaseModifier(modifierId, type);
    console.log('Purchase result:', success);
    
    if (success) {
      const playerMoney = GameService.getPlayerMoney();
      console.log('Player money after purchase:', playerMoney);
      res.json({ 
        success: true, 
        message: 'Purchase successful',
        playerMoney 
      });
    } else {
      const playerMoney = GameService.getPlayerMoney();
      console.log('Purchase failed, player money:', playerMoney);
      res.status(400).json({ 
        success: false, 
        error: 'Purchase failed - insufficient funds or item not available',
        playerMoney
      });
    }
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Failed to purchase modifier' });
  }
};

export const getPlayerMoney = (req: Request, res: Response) => {
  try {
    const money = GameService.getPlayerMoney();
    res.json({ money });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get player money' });
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Game server is running' });
}; 