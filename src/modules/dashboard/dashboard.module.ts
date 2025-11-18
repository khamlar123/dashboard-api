import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SharedModule } from '../../share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [DashboardController],
  providers: [DashboardService, DatabaseService],
})
export class DashboardModule {}
