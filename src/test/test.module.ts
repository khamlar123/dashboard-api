import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtUtilsService } from 'src/common/jwt/jwtDecoder';
import { BaseController } from 'src/Interceptors/base.controller';

@Module({
  controllers: [TestController],
  providers: [TestService, DatabaseService, JwtUtilsService, BaseController],
})
export class TestModule {}
