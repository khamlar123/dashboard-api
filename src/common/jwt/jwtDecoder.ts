// src/auth/jwt-utils.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class JwtUtilsService {
  sign(object: any, key: string): string {
    try {
      const token = jwt.sign(object, key, {
        expiresIn: '1h',
        algorithm: 'HS256',
      });

      return token;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  decodeToken(token: string): any {
    try {
      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      // Decode without verification (use verify() if you need to validate)
      const decoded = jwt.decode(cleanToken);

      return decoded;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  verifyToken(token: string, secret: string): JwtPayload {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
