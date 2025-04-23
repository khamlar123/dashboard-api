import { Module } from '@nestjs/common';
import { CronjobController } from './cronjob.controller';
import { DatabaseService } from 'src/common/database/database.service';

import { SharedModule } from 'src/share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [CronjobController],
  providers: [DatabaseService],
})
export class CronjobModule {}
