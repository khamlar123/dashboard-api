import { Module } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { ProfitController } from './profit.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ProfitController],
  providers: [ProfitService, DatabaseService],
})
export class ProfitModule {}
