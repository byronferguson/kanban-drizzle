import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/auth.js';

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized
  }

  const [_, token = ''] = authHeader.split(' ');

  try {
    req.user = await verifyToken(token);
    return next();
  } catch (error) {
    return res.sendStatus(403); // Forbidden
  }
}
