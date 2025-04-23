// src/middleware/basic-auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { env } from 'process';

@Injectable()
export class AuthSwagger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const auth = { login: env.SWAGGER_USER, password: env.SWAGGER_PASSWORD }; // change these values

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');

    if (
      login &&
      password &&
      login === auth.login &&
      password === auth.password
    ) {
      return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
  }
}
