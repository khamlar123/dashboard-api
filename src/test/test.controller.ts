import { Controller, Get, Param } from '@nestjs/common';
import { TestService } from './test.service';
import { JwtUtilsService } from '../jwt/jwtDecoder';
import { JwtPayload } from 'src/interfaces/jwtPayload.interface';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly jwt: JwtUtilsService,
  ) {}

  @Get()
  async findAll() {
    return this.testService.findAll();
  }
  @Get('/test-token')
  async testToken(): Promise<JwtPayload> {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGFyIiwiaWQiOjEsImlhdCI6MTc0MzQxNTEwNiwiZXhwIjoxNzQzNDE4NzA2fQ.omQfhtfrAbnI0sbplnjXrLu6Qnk3KhiJVglrUM__1m0';
    const key = 'superman';
    const verifyToken = this.jwt.verifyToken(token, key);

    return verifyToken;
  }

  @Get('/test-sign')
  async signToken(): Promise<string> {
    const token = this.jwt.sign({ name: 'lar', id: 1 }, 'superman');

    return token;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }
}
