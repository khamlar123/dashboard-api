import { Module } from '@nestjs/common';
import { SectorBalService } from './sector_bal.service';
import { SectorBalController } from './sector_bal.controller';
import { DatabaseService } from '../../common/database/database.service';
import { SharedModule } from '../../share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [SectorBalController],
  providers: [SectorBalService, DatabaseService],
})
export class SectorBalModule {}
