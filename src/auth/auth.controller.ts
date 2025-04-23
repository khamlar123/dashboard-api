import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { ValidateTokenDto } from '../dto/validate-token.dto';
import { RefreshTokenDto } from '../dto/refresh.dto';
import { Response } from 'express';
import { cookie } from '../share/functions/cookie';

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
  async validateToken(@Body() dto: ValidateTokenDto): Promise<boolean> {
    return await this.authService.validateToken(dto);
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(dto, res);
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
