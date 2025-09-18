import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { SharedModule } from '../../share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [AccountsController],
  providers: [AccountsService, DatabaseService],
})
export class AccountsModule {}
