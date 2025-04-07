import { Module } from '@nestjs/common';
import { IncomePlanService } from './income_plan.service';
import { IncomePlanController } from './income_plan.controller';
import { SharedModule } from 'src/share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [IncomePlanController],
  providers: [IncomePlanService],
})
export class IncomePlanModule {}
