import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { cookie } from '../../share/functions/cookie';
import { IRefreshToken } from '../interfaces/refresh-token.intrerface';

@Injectable()
export class AuthGuard {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    async function validateToken(atoken: any): Promise<boolean> {
      const params = new URLSearchParams();
      params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
      params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
      params.append('token', atoken);
      try {
        const response = await axios.post(
          `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token/introspect`,
          params,
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        );
        return response.data?.active || false;
      } catch (err) {
        console.log(err.message);
        return false;
      }
    }

    async function refreshTokenFunc(
      aRefreshToken: any,
    ): Promise<IRefreshToken> {
      const params = new URLSearchParams();
      params.append('refresh_token', aRefreshToken);
      params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
      params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
      params.append('grant_type', 'refresh_token');

      const response = await axios.post(
        `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      return {
        accessToken,
        refreshToken,
        expires: response.data.expires_in,
        expiresRefresh: response.data.refresh_expires_in,
      };
    }

    const token: string = cookie(req, 'accessToken');
    const refreshToken: string = cookie(req, 'refreshToken');
    if (token) {
      // check has token?
      return await validateToken(token);
    } else if (!token && refreshToken) {
      // token expires check refresh token and gen new token
      const refreshCall = await refreshTokenFunc(refreshToken);
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
      return await validateToken(refreshCall.accessToken);
    } else {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }
}
