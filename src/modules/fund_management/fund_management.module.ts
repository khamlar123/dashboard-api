import { Module } from '@nestjs/common';
import { FundManagementService } from './fund_management.service';
import { FundManagementController } from './fund_management.controller';
import { SharedModule } from '../../share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [FundManagementController],
  providers: [FundManagementService, DatabaseService],
})
export class FundManagementModule {}
