import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtUtilsService } from 'src/jwt/jwtDecoder';

@Module({
  controllers: [TestController],
  providers: [TestService, DatabaseService, JwtUtilsService],
})
export class TestModule {}
