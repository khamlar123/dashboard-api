import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto } from '../../dto/login.dto';
import { Response } from 'express';
import * as moment from 'moment';

import { IRefreshToken } from '../../common/interfaces/refresh-token.intrerface';
import { iKeycloakLogin } from '../../common/interfaces/keycloak-login.interface';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { compareHash } from '../../share/functions/hash-unity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(employee_id: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { employee_id },
    });

    if (!user) {
      throw new BadRequestException('Wrong username');
    }

    const passwordIsValid = await compareHash(password, user.password);
    if (!passwordIsValid) {
      throw new BadRequestException('Wrong password');
    }

    if (!user.is_active) {
      throw new BadRequestException('Account is currently deactivated');
    }

    return user;
  }

  async signTokens(userName: string, employee_id: string, res: Response) {
    const secret = process.env.JWT_SECRET;
    // String payload doesn't accept expiresIn option, use object payload instead
    const genToken = {
      userName,
      employee_id,
    };

    // Generate and save new refresh token
    const accessToken = this.jwtService.sign(genToken, {
      secret: secret,
      expiresIn: process.env.JWT_TIME,
    });

    return accessToken;
  }

  // keycloak
  // async login(dto: LoginDto, res: Response): Promise<any> {
  //   const login: iKeycloakLogin = await loginFunc(dto);
  //
  //   if (!login.expires_in)
  //     throw new InternalServerErrorException('Access token is invalid');
  //
  //   res.cookie('accessToken', login.access_token, {
  //     httpOnly: true,
  //     secure: this.configService.get('NODE_ENV') === 'production',
  //     expires: moment(Date.now() + login.expires_in * 1000).toDate(),
  //   });
  //
  //   if (!login.refresh_expires)
  //     throw new InternalServerErrorException('Refresh token is invalid');
  //
  //   res.cookie('refreshToken', login.refresh_token, {
  //     httpOnly: true,
  //     secure: this.configService.get('NODE_ENV') === 'production',
  //     expires: moment(Date.now() + login.refresh_expires * 1000).toDate(),
  //   });
  //
  //   return login;
  // }
  //
  // async validateToken(token: string): Promise<boolean> {
  //   return validateTokenFunc(token);
  // }
  //
  // async refresh(refreshToken: string, res: Response): Promise<any> {
  //   const refreshCall: IRefreshToken = await refreshTokenFunc(refreshToken);
  //   res.cookie('accessToken', refreshCall.accessToken, {
  //     httpOnly: true,
  //     secure: false,
  //     expires: moment(Date.now() + refreshCall.expires * 1000).toDate(),
  //   });
  //
  //   res.cookie('refreshToken', refreshCall.refreshToken, {
  //     httpOnly: true,
  //     secure: false,
  //     expires: moment(Date.now() + refreshCall.expiresRefresh * 1000).toDate(),
  //   });
  //   return refreshCall;
  // }
  //
  // async logoutFromKeycloak(refreshToken: string): Promise<boolean> {
  //   return await logoutFunc(refreshToken);
  // }
  //
  // async users(token: string): Promise<any> {
  //   return await users(token);
  // }
  //
  // async userInfo(token: string): Promise<any> {
  //   return await userInfo(token);
  // }

  //end keycloak
}
