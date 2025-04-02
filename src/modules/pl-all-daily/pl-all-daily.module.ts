import { Module } from '@nestjs/common';
import { PlAllDailyService } from './pl-all-daily.service';
import { PlAllDailyController } from './pl-all-daily.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlAllDaily } from 'src/entity/pl-all-daily.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlAllDaily])],
  controllers: [PlAllDailyController],
  providers: [PlAllDailyService],
})
export class PlAllDailyModule {}
