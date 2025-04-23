import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { HttpService } from '@nestjs/axios';
import { LoginDto } from '../dto/login.dto';
import axios from 'axios';
import { ValidateTokenDto } from '../dto/validate-token.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { RefreshTokenDto } from '../dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, res: Response) {
    const params = new URLSearchParams();
    params.append('username', dto.username);
    params.append('password', dto.password);
    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
    params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
    params.append('grant_type', process.env.KEYCLOAK_TYPE || 'password');
    try {
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
      const decoded = jwt.decode(accessToken) as any;

      if (!response.data.expires_in)
        throw new InternalServerErrorException('Access token is invalid');

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: moment(Date.now() + response.data.expires_in * 1000).toDate(),
      });

      if (!response.data.refresh_expires_in)
        throw new InternalServerErrorException('Refresh token is invalid');

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: moment(
          Date.now() + response.data.refresh_expires_in * 1000,
        ).toDate(),
      });

      const result = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: response.data.expires_in,
        user: {
          username: decoded.preferred_username,
          email: decoded.email,
          roles: decoded.realm_access?.roles || [],
        },
      };
      return result;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async validateToken(dto: ValidateTokenDto): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
    params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
    params.append('token', dto.token);

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token/introspect`,
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    return response.data?.active || false;
  }

  async refresh(dto: RefreshTokenDto, res: Response) {
    const params = new URLSearchParams();
    params.append('refresh_token', dto.refreshToken);
    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
    params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
    params.append('grant_type', 'refresh_token');
    try {
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
      const decoded = jwt.decode(accessToken) as any;

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: moment(Date.now() + response.data.expires_in * 1000).toDate(),
      });

      if (!response.data.refresh_expires_in)
        throw new InternalServerErrorException('Refresh token is invalid');

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: moment(
          Date.now() + response.data.refresh_expires_in * 1000,
        ).toDate(),
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: response.data.expires_in,
        user: {
          username: decoded.preferred_username,
          email: decoded.email,
          roles: decoded.realm_access?.roles || [],
        },
      };
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async logoutFromKeycloak(refreshToken: string) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
    params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
    params.append('refresh_token', refreshToken);

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/logout`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.status;
  }
}
