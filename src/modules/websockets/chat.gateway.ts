import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@WebSocketGateway({
  cors: {
    origin: ['*'], // Angular/ Nuxt dev server
  },
  transports: ['websocket'], // <--- ensure WebSocket
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(User)
    private readonly userRes: Repository<User>,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('text-chat')
  handleMessage(@MessageBody() message: iMessage): void {
    console.log('📩 Message received:', message);
    // broadcast message back to all clients
    this.server.emit('text-chat', message);
  }

  @SubscribeMessage('get_users')
  async handleGetUsers() {
    console.log('📩 get_user event:');
    return await this.userRes.find({});
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: ChatInterface,
    @ConnectedSocket() client: Socket,
  ) {
    // Make the client join a room
    client.join(`chat-user-${data.userId}`);
    console.log(`User ${data.userId} joined room`);

    this.server.to(`chat-user-${data.userId}`).emit('private-message', {
      from: 'admin',
      message: 'Admin chat to user test 🚀',
    });

    this.server.on(`chat-user-${data.userId}`, (res) => {
      console.log('resss', res);
    });
  }
}

export interface iMessage {
  name: string;
  message: string;
}

export interface ChatInterface {
  userId: number;
  title: string;
  message: string;
}
