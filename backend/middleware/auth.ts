import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey') as { userId: number };
    req.userId = decoded.userId;
    next(); // สำคัญ! ต้องเรียก next() เพื่อให้ไป middleware ถัดไป
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
