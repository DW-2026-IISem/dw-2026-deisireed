import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../auth/jwt';

export const authenticateJwt = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token de acceso no proporcionado.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = JwtService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
  }
};
