import { Module } from '@nestjs/common';
import { PaidService } from './paid.service';
import { PaidController } from './paid.controller';
import { SharedModule } from '../../share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [PaidController],
  providers: [PaidService, DatabaseService],
})
export class PaidModule {}
