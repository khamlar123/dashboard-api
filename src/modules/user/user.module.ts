import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from '../../share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
