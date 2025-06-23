import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/gameRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', gameRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Balatro Clone API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      game: {
        initial: '/api/game/initial',
        settings: '/api/game/settings',
        playHand: '/api/game/play-hand',
        drawCards: '/api/game/draw-cards'
      },
      shop: {
        jokers: '/api/shop/jokers',
        planets: '/api/shop/planets',
        tarot: '/api/shop/tarot',
        purchase: '/api/shop/purchase'
      }
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Balatro Clone API server running on port ${PORT}`);
  console.log(`📱 API Documentation: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});

export default app; 