import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from '../../dto/login.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import {
  loginFunc,
  logoutFunc,
  refreshTokenFunc,
  userInfo,
  users,
  validateTokenFunc,
} from '../../common/keycloak/keycloak.service';
import { IRefreshToken } from '../../common/interfaces/refresh-token.intrerface';
import { iKeycloakLogin } from '../../common/interfaces/keycloak-login.interface';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async login(dto: LoginDto, res: Response): Promise<any> {
    const login: iKeycloakLogin = await loginFunc(dto);

    if (!login.expires_in)
      throw new InternalServerErrorException('Access token is invalid');

    res.cookie('accessToken', login.access_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: moment(Date.now() + login.expires_in * 1000).toDate(),
    });

    if (!login.refresh_expires)
      throw new InternalServerErrorException('Refresh token is invalid');

    res.cookie('refreshToken', login.refresh_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: moment(Date.now() + login.refresh_expires * 1000).toDate(),
    });

    return login;
  }

  async validateToken(token: string): Promise<boolean> {
    return validateTokenFunc(token);
  }

  async refresh(refreshToken: string, res: Response): Promise<any> {
    const refreshCall: IRefreshToken = await refreshTokenFunc(refreshToken);
    res.cookie('accessToken', refreshCall.accessToken, {
      httpOnly: true,
      secure: false,
      expires: moment(Date.now() + refreshCall.expires * 1000).toDate(),
    });

    res.cookie('refreshToken', refreshCall.refreshToken, {
      httpOnly: true,
      secure: false,
      expires: moment(Date.now() + refreshCall.expiresRefresh * 1000).toDate(),
    });
    return refreshCall;
  }

  async logoutFromKeycloak(refreshToken: string): Promise<boolean> {
    return await logoutFunc(refreshToken);
  }

  async users(token: string): Promise<any> {
    return await users(token);
  }

  async userInfo(token: string): Promise<any> {
    return await userInfo(token);
  }
}
