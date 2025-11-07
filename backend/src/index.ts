import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { setupSocketIO } from './config/socket';
import characterRoutes from './routes/character.routes';
import dungeonRoutes from './routes/dungeon.routes';
import combatRoutes from './routes/combat.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import questRoutes from './routes/quest.routes';
import guildRoutes from './routes/guild.routes';
import pvpRoutes from './routes/pvp.routes';
import gachaRoutes from './routes/gacha.routes';
import userRoutes from './routes/user.routes';
import nftRoutes from './routes/nft.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/characters', characterRoutes);
app.use('/api/dungeon', dungeonRoutes);
app.use('/api/combat', combatRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/guilds', guildRoutes);
app.use('/api/pvp', pvpRoutes);
app.use('/api/gacha', gachaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nft', nftRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dead Zone API is running' });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Aeloria Backend running on port ${PORT}`);
    });

    // Setup Socket.IO for real-time features
    setupSocketIO(server);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
