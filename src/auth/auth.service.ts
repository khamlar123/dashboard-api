import { BadRequestException, Injectable } from '@nestjs/common';
import { JwksClient } from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}
  async verify(): Promise<any> {
    const KEYCLOAK_ISSUER = 'http://10.151.146.245:9001/realms/apbtest';
    const JWKS_URI = `${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`;
    const client = new JwksClient({ jwksUri: JWKS_URI });

    const response = await firstValueFrom(this.httpService.get(JWKS_URI));

    function getKey(header) {
      console.log('im here1');

      client.getSigningKey(header.kid, (err, key: any) => {
        console.log('im here2');
        if (err) {
          throw new BadRequestException(err);
        }
        const signingKey = key.getPublicKey();

        return signingKey;
      });
    }

    return getKey(response.headers);
  }
}
