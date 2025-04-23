import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { SharedModule } from 'src/share/shared.module';
import { DatabaseService } from 'src/common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [BranchController],
  providers: [BranchService, DatabaseService],
})
export class BranchModule {}
