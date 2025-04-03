import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { TestModule } from './test/test.module';
import { logger } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { IncomeDailyModule } from './modules/income-daily/income-daily.module';
import { ExpenseDailyModule } from './modules/expense-daily/expense-daily.module';
import { PlAllDailyModule } from './modules/pl-all-daily/pl-all-daily.module';
import { IncomeMonthlyModule } from './modules/income-monthly/income-monthly.module';
import { ExpenseMonthlyModule } from './modules/expense-monthly/expense-monthly.module';
import { PlAllMonthlyModule } from './modules/pl-all-monthly/pl-all-monthly.module';
import { TreasureModule } from './modules/treasure/treasure.module';
import { InExProYearModule } from './modules/in_ex_pro_year/in_ex_pro_year.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MulterModule.register({
      dest: './files', // Destination folder where uploaded files will be stored
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Sync models with database (disable in production)
    }),
    TestModule,
    IncomeDailyModule,
    ExpenseDailyModule,
    PlAllDailyModule,
    IncomeMonthlyModule,
    ExpenseMonthlyModule,
    PlAllMonthlyModule,
    TreasureModule,
    InExProYearModule,
    AuthModule,
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
