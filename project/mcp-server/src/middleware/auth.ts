import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  // For development, allow the MCP_SERVER_TOKEN
  if (token === process.env.MCP_SERVER_TOKEN) {
    req.user = { id: 'system', role: 'admin' };
    return next();
  }

  try {
    // For production, verify JWT tokens
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid authentication token', { token: token.substring(0, 10) + '...' });
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
};