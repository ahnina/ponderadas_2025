import { Router } from 'express';
import {
  getInitialGameState,
  playHand,
  drawCards,
  discardCards,
  getAvailableJokers,
  getAvailablePlanets,
  getAvailableTarot,
  purchaseModifier,
  getPlayerMoney,
  healthCheck
} from '../controllers/gameController';

const router = Router();

// Health check
router.get('/health', healthCheck);

// Game state
router.get('/game/state', getInitialGameState);

// Game actions
router.post('/game/play-hand', playHand);
router.post('/game/draw-cards', drawCards);
router.post('/game/discard-cards', discardCards);

// Shop
router.get('/shop/jokers', getAvailableJokers);
router.get('/shop/planets', getAvailablePlanets);
router.get('/shop/tarot', getAvailableTarot);
router.post('/shop/purchase', purchaseModifier);

// Player info
router.get('/player/money', getPlayerMoney);

export default router; 