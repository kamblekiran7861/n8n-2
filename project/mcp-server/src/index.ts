import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { agentRoutes } from './routes/agents.js';
import { llmRoutes } from './routes/llm.js';
import { monitoringRoutes } from './routes/monitoring.js';
import { notificationRoutes } from './routes/notifications.js';
import { loggingRoutes } from './routes/logging.js';

dotenv.config();

const app = express();
const PORT = process.env.MCP_SERVER_PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Apply authentication middleware to all routes except health check
app.use(authMiddleware);

// Routes
app.use('/agent', agentRoutes);
app.use('/llm', llmRoutes);
app.use('/monitoring', monitoringRoutes);
app.use('/notifications', notificationRoutes);
app.use('/logging', loggingRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  logger.info(`MCP Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;