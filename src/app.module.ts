import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { logger } from './middleware/logger.middleware';
import { AuthMiddleware } from './middleware/auth.middleware';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Sync models with database (disable in production)
    }),
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(logger)
  //     .forRoutes('*') // applies to all routes
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       { path: 'users', method: RequestMethod.POST }, // exclude user creation
  //       'users/(.*)', // exclude all user routes for this example
  //     )
  //     .forRoutes('*'); // applies to remaining routes
  // }
}
