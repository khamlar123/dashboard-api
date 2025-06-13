import { Controller } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/entity/branch.entity';
import { Repository } from 'typeorm';
import { IncomeCode } from 'src/entity/income_code.entity';
import { Income } from 'src/entity/income.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';
import { Expense } from 'src/entity/expense.entity';
import { formatDate } from 'src/share/functions/format-date';
import { LoanPlan } from '../../entity/loan_plan.entity';
import { Loan } from '../../entity/loan.entity';

@Controller('cronjob')
export class CronjobController {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(IncomeCode)
    private readonly incomeCodeRepository: Repository<IncomeCode>,
    @InjectRepository(ExpenseCode)
    private readonly expenseCodeRepository: Repository<ExpenseCode>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(LoanPlan)
    private readonly loanPlanRepository: Repository<LoanPlan>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  //@Cron('* * * * *') //1min
  // @Cron('0 6 * * *') // 6AM
  // async storeIncomeData(): Promise<void> {
  //   const [branches, incomeCodes] = await Promise.all([
  //     this.branchRepository.find({}),
  //     this.incomeCodeRepository.find({}),
  //   ]);
  //
  //   function getBranch(code: string) {
  //     return branches.find((b: any) => String(b.code) === code);
  //   }
  //
  //   function getIncomeCode(code: string) {
  //     return incomeCodes.find((i: any) => String(i.code) === String(code));
  //   }
  //
  //   const queryData = await this.databaseService.queryOds(income);
  //
  //   const mapData = queryData.map((m) => {
  //     const branch = getBranch(m.branch_code.padEnd(6, '0'));
  //     const incomeCode = getIncomeCode(m.id);
  //     return {
  //       branch: branch,
  //       amount: m.bal,
  //       scaled_amount: m.balM,
  //       date: moment(m.ac_date, 'YYYYMMDD').endOf('day').format('YYYY-MM-DD'),
  //       income_code: incomeCode,
  //       description: '',
  //     };
  //   });
  //
  //   console.log('mapData', mapData);
  //
  //   // const addItems = await this.incomeRepository.save(mapData);
  //   //
  //   // if (addItems) {
  //   //   Logger.log(
  //   //     'cron job store Income data saved day -1 successfully ' +
  //   //       moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
  //   //   );
  //   // } else {
  //   //   Logger.error('Failed to save income data');
  //   // }
  // }

  //@Cron('* * * * *') 1min
  // @Cron('2 6 * * *') // 6AM 2min
  // async storeExpenseData(): Promise<void> {
  //   const dateDeleteOneDay = moment().add(-1, 'day').format('YYYYMMDD');
  //   const queryData = await this.databaseService.queryOds(expense);
  //
  //   const [branches, expenseCodes] = await Promise.all([
  //     this.branchRepository.find({}),
  //     this.expenseCodeRepository.find({}),
  //   ]);
  //
  //   function getBranch(code: string) {
  //     return branches.find((b: any) => String(b.code) === code);
  //   }
  //
  //   function getCode(code: string) {
  //     return expenseCodes.find((i: any) => String(i.code) === String(code));
  //   }
  //
  //   const mapData = queryData.map((m: any) => {
  //     const branch = getBranch(m.branch_code.padEnd(6, '0'));
  //     const expenseCode = getCode(m.id);
  //     return {
  //       branch: { code: branch?.code },
  //       amount: m.bal,
  //       scaled_amount: m.balM,
  //       date: moment(m.ac_date, 'YYYYMMDD').endOf('day').format('YYYY-MM-DD'),
  //       expense_code: { code: expenseCode?.code },
  //       description: '',
  //     };
  //   });
  //
  //   const addItems = await this.expenseRepository.save(mapData);
  //   if (addItems) {
  //     Logger.log(
  //       'cron job store expense data saved day - 1 successfully ' +
  //         moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
  //     );
  //   } else {
  //     Logger.error('Failed to save expense data');
  //   }
  // }

  //@Cron('* * * * *')
  // @Cron('5 6 * * *') // 6AM 5min
  // async calcProfit(): Promise<void> {
  //   const dateDeleteOneDay = moment().add(-1, 'day').format('YYYY-MM-DD');
  //   const results = await this.databaseService.procedure(
  //     'p_profit',
  //     dateDeleteOneDay,
  //   );
  //
  //   if (results) {
  //     Logger.log(
  //       'cron job calculate profit successfully ' +
  //         moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
  //     );
  //   } else {
  //     Logger.error('Failed to calculate data');
  //   }
  // }
  //
  // //@Cron('* * * * *')
  // @Cron('7 6 * * *')
  // async storeLoan(): Promise<void> {
  //   const dateDeleteOneDay = moment().add(-1, 'day').format('YYYYMMDD');
  //   const results = await this.databaseService.queryOds(loan, [
  //     dateDeleteOneDay,
  //   ]);
  //
  //   formatDate(results);
  //
  //   const [findBranch, findLoanPlan] = await Promise.all([
  //     this.branchRepository.find({}),
  //     this.loanPlanRepository.find({
  //       relations: {
  //         branch: true,
  //       },
  //     }),
  //   ]);
  //
  //   function getBranch(code: string) {
  //     return findBranch.find((b: any) => String(b.code) === code);
  //   }
  //
  //   function getLoanPlan(year: string, bcode: string) {
  //     return findLoanPlan.find(
  //       (f: LoanPlan) => f.branch?.code === Number(bcode) && f.year === year,
  //     );
  //   }
  //
  //   const mapData = results.map((m) => {
  //     const getB = getBranch(m.Branch_code.padEnd(6, '0'));
  //     const getL = getLoanPlan(
  //       moment(m.Dates).year().toString(),
  //       m.Branch_code.padEnd(6, '0'),
  //     );
  //     return {
  //       date: m.Date,
  //       balance: m.Loan_Balance_Daily,
  //       npl_balance: m.NPL_Balance_Daily ?? 0,
  //       fund: m.Fund,
  //       drawndown: m.Drawndown_Daily,
  //       branch: { code: getB?.code },
  //       a: m.A ?? 0,
  //       b: m.B ?? 0,
  //       c: m.C ?? 0,
  //       d: m.D ?? 0,
  //       e: m.E ?? 0,
  //       short: m.Short ?? 0,
  //       middle: m.Middle ?? 0,
  //       longs: m.Longs ?? 0,
  //       loan_plan: getL,
  //     };
  //   });
  //   const add: any = await this.loanRepository.save(mapData);
  //   if (add) {
  //     Logger.log(
  //       'cron job store loan data saved day - 1 successfully ' +
  //         moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
  //     );
  //   } else {
  //     Logger.error('Failed to save expense data');
  //   }
  // }
}
