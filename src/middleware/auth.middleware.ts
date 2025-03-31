import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // In a real app, you would validate the token here
    const token = authHeader.split(' ')[1];
    if (token !== 'secret-token') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    next();
  }
}
