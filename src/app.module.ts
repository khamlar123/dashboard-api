import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { TestModule } from './test/test.module';
import { logger } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './modules/branch/branch.module';
import { IncomePlanModule } from './modules/income_plan/income_plan.module';
import { IncomeCodeModule } from './modules/income_code/income_code.module';
import { IncomeModule } from './modules/income/income.module';
import { ExpensePlanModule } from './modules/expense_plan/expense_plan.module';
import { ExpenseCodeModule } from './modules/expense_code/expense_code.module';
import { ExpenseModule } from './modules/expense/expense.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MulterModule.register({
      dest: './files', // Destination folder where uploaded files will be stored
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Sync models with database (disable in production)
    }),
    AuthModule,
    BranchModule,
    IncomePlanModule,
    IncomeCodeModule,
    IncomeModule,
    ExpensePlanModule,
    ExpenseCodeModule,
    ExpenseModule,
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
