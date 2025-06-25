import { Module } from '@nestjs/common';
import { SeetorService } from './seetor.service';
import { SeetorController } from './seetor.controller';

@Module({
  controllers: [SeetorController],
  providers: [SeetorService],
})
export class SeetorModule {}
