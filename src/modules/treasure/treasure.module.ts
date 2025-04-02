import { Module } from '@nestjs/common';
import { TreasureService } from './treasure.service';
import { TreasureController } from './treasure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasure } from 'src/entity/treasure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Treasure])],
  controllers: [TreasureController],
  providers: [TreasureService],
})
export class TreasureModule {}
