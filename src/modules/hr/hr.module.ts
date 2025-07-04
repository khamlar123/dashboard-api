import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { SharedModule } from '../../share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
