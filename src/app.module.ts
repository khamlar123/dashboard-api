import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { logger } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './modules/auth/auth.module';
import { BranchModule } from './modules/branch/branch.module';
import { IncomePlanModule } from './modules/income_plan/income_plan.module';
import { IncomeCodeModule } from './modules/income_code/income_code.module';
import { IncomeModule } from './modules/income/income.module';
import { ExpensePlanModule } from './modules/expense_plan/expense_plan.module';
import { ExpenseCodeModule } from './modules/expense_code/expense_code.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { CronjobModule } from './modules/cronjob/cronjob.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProfitModule } from './modules/profit/profit.module';
import { LoanPlanModule } from './modules/loan_plan/loan_plan.module';
import { LoanModule } from './modules/loan/loan.module';
import { SectorBalModule } from './modules/sector_bal/sector_bal.module';
import { FinancialModule } from './modules/financial/financial.module';
import { DepositModule } from './modules/deposit/deposit.module';
import { ImportModule } from './modules/import/import.module';
import { AdminModule } from './modules/admin/admin.module';
import { MarketModule } from './modules/market/market.module';
import { FundManagementModule } from './modules/fund_management/fund_management.module';
import { HrModule } from './modules/hr/hr.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { UserModule } from './modules/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from './common/database/database.service';
import { PaidModule } from './modules/paid/paid.module';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { MainModule } from './modules/main/main.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // optional if default
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
      synchronize: false, // Sync models with database (disable in production)
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    BranchModule,
    IncomePlanModule,
    IncomeCodeModule,
    IncomeModule,
    ExpensePlanModule,
    ExpenseCodeModule,
    ExpenseModule,
    CronjobModule,
    ProfitModule,
    LoanPlanModule,
    LoanModule,
    SectorBalModule,
    FinancialModule,
    DepositModule,
    ImportModule,
    AdminModule,
    MarketModule,
    FundManagementModule,
    HrModule,
    MonitorModule,
    PaidModule,
    WebsocketsModule,
    AccountsModule,
    MainModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, DatabaseService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(logger)
  //     .forRoutes('*') // applies to all routes
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       { path: 'auth', method: RequestMethod.POST }, // exclude user creation
  //       'auth/(.*)', // exclude all user routes for this example
  //     )
  //     .forRoutes('*'); // applies to remaining routes
  // }
}
