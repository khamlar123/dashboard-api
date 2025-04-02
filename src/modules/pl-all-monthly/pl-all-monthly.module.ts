import { Module } from '@nestjs/common';
import { PlAllMonthlyService } from './pl-all-monthly.service';
import { PlAllMonthlyController } from './pl-all-monthly.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlAllMonthly } from 'src/entity/pl-all-monthly.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlAllMonthly])],
  controllers: [PlAllMonthlyController],
  providers: [PlAllMonthlyService],
})
export class PlAllMonthlyModule {}
