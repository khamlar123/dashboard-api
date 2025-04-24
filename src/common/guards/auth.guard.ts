import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as moment from 'moment';
import { cookie } from '../../share/functions/cookie';
import { IRefreshToken } from '../interfaces/refresh-token.intrerface';
import {
  refreshTokenFunc,
  validateTokenFunc,
} from '../keycloak/keycloak.service';

@Injectable()
export class AuthGuard {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const token: string = cookie(req, 'accessToken');
    const refreshToken: string = cookie(req, 'refreshToken');
    if (token && refreshToken) {
      // check has token?
      return await validateTokenFunc(token);
    } else if (!token && refreshToken) {
      // token expires check refresh token and gen new token
      const refreshCall: IRefreshToken = await refreshTokenFunc(refreshToken);
      res.cookie('accessToken', refreshCall.accessToken, {
        httpOnly: true,
        secure: false,
        expires: moment(Date.now() + refreshCall.expires * 1000).toDate(),
      });

      res.cookie('refreshToken', refreshCall.refreshToken, {
        httpOnly: true,
        secure: false,
        expires: moment(
          Date.now() + refreshCall.expiresRefresh * 1000,
        ).toDate(),
      });
      return await validateTokenFunc(refreshCall.accessToken);
    } else {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }
}
