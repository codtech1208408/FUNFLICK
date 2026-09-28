import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'funflick-super-secret-production-jwt-key-2026';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const signToken = (user: { id: string; email: string; username: string; role: string; status: string }) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true, role: true, status: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found' });
    }

    if (user.status === 'BLOCKED') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, username: true, role: true, status: true }
      });
      if (user && user.status !== 'BLOCKED') {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: [${roles.join(', ')}]`
      });
    }

    next();
  };
};
