import { Module } from '@nestjs/common';
import { IncomePlanService } from './income_plan.service';
import { IncomePlanController } from './income_plan.controller';
import { SharedModule } from 'src/share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [IncomePlanController],
  providers: [IncomePlanService, DatabaseService],
})
export class IncomePlanModule {}
