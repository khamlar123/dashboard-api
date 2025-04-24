import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../dto/login.dto';
import { Response } from 'express';
import { cookie } from '../../share/functions/cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(dto, res);
  }

  @Post('validateToken')
  async validateToken(@Req() req: Request): Promise<boolean> {
    const token: string = cookie(req, 'accessToken');
    return await this.authService.validateToken(token);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken: string = cookie(req, 'refreshToken');
    return await this.authService.refresh(refreshToken, res);
  }

  @Get('users')
  async register(@Req() req: Request) {
    const token: string = cookie(req, 'accessToken');
    return await this.authService.users(token);
  }

  @Post('user-info')
  async userInfo(@Req() req: Request) {
    const token: string = cookie(req, 'accessToken');
    return await this.authService.userInfo(token);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = cookie(req, 'refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const logoutItem = await this.authService.logoutFromKeycloak(refreshToken);
    if (logoutItem) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.send({
        message: 'Logged out successfully',
        data: {},
        status: 204,
      });
    }
    // Clear cookies
  }
}
