// auth.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly keycloakUrl = process.env.KEYCLOAK_API_URL;
  private readonly clientId = process.env.KEYCLOAK_CLIENT_ID;
  private readonly clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  async login(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', 'nest_tes');
    params.append('password', '123456');
    params.append('client_id', 'account');
    params.append('grant_type', 'password');

    try {
      const response = await axios.post(
        `http://localhost:8080/realms/nest-api-realm/protocol/openid-connect/auth`,
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
}
