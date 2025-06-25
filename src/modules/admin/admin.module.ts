import { Module } from '@nestjs/common';
import { SharedModule } from '../../share/shared.module';
import { DatabaseService } from '../../common/database/database.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [SharedModule],
  controllers: [AdminController],
  providers: [AdminService, DatabaseService],
})
export class AdminModule {}
