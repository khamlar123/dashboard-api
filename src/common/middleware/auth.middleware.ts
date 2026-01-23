import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
      console.log(
        "🚀 ~ use ~ req.originalUrl.split('-')[0]: ",
        req.originalUrl,
      );
      const publicKey = fs.readFileSync('src/common/jwt/public.key');
      const payload = this.jwtService.verify(token, {
        secret: publicKey,
        algorithms: ['RS512'],
      });

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        throw new UnauthorizedException('Token has expired');
      }

      // You can attach user info to request if needed
      (req as any).user = payload;

      if (
        req.originalUrl.split('-')[0] === '/import' &&
        req.method === 'POST'
      ) {
        await firstValueFrom(
          this.httpService.post(
            `${process.env.AUTHEN_URL}/actions`,
            {
              method: req.method,
              url: req.originalUrl,
              user_id: payload.user_id,
              request: JSON.stringify(req.body) ?? null,
              system_name: 'Dashboard System',
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );
      }

      const log = `userId:${payload.employee_id} user:${payload.userName} [${new Date().toISOString()}] ${req.method} ${req.originalUrl} }\n`;
      const logFolder = path.join(__dirname, '../../../logs');
      const fileName = `logs-${moment().format('yyyyMMDD')}.txt`;
      const logFilePath = path.join(logFolder, fileName);
      // Append log to file (create if it doesn't exist)

      if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder, { recursive: true });
      }

      fs.appendFile(logFilePath, log, (err) => {
        if (err) {
          console.error('Error writing log file:', err);
        }
      });

      next();
    } catch (err) {
      // Handle token errors gracefully
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }
}
