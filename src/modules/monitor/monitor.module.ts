import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { SharedModule } from '../../share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [MonitorController],
  providers: [MonitorService, DatabaseService],
})
export class MonitorModule {}
