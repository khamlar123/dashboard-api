import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { SharedModule } from '../../share/shared.module';

@Module({
  providers: [ChatGateway],
  imports: [SharedModule],
})
export class WebsocketsModule {}
