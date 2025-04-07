import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { SharedModule } from 'src/share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
