import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from '../../dto/create-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/entity/branch.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateBranchDto } from 'src/dto/update-branch.dto';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { IncomePlan } from 'src/entity/income_plan.entity';
import { IncomeCode } from 'src/entity/income_code.entity';
import { ExpensePlan } from 'src/entity/expense_plan.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(IncomePlan)
    private readonly incomePlanRepository: Repository<IncomePlan>,
    @InjectRepository(IncomeCode)
    private readonly incomeCodeRepository: Repository<IncomeCode>,
    @InjectRepository(ExpensePlan)
    private readonly expensePlanRepository: Repository<ExpensePlan>,
    @InjectRepository(ExpenseCode)
    private readonly expenseCodeRepository: Repository<ExpenseCode>,
    private readonly db: DatabaseService,
  ) {}

  async create(dto: CreateBranchDto): Promise<any> {
    try {
      return await this.branchRepository.save(dto);
    } catch (e) {
      return e.message;
    }
  }

  async findAll() {
    try {
      const item = await this.branchRepository.find();
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async findOne(code: number) {
    try {
      const item = await this.branchRepository.findOne({
        where: { code },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async update(id: number, dto: UpdateBranchDto) {
    try {
      return await this.branchRepository.update(id, dto);
    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    try {
      return await this.branchRepository.delete(id);
    } catch (e) {
      return e.message;
    }
  }

  // user char 1
  async income(bcode?: string, date?: string) {
    try {
      const queryDate = moment(date).toDate();
      const year = moment(queryDate).year().toString();
      const whereCondition = {
        code: bcode ? Number(bcode) : null,
        income: {
          date: queryDate, // Example with date range
        },
        // incomePlans: {
        //   year: year, // Example with date range
        // },
      } as FindOptionsWhere<Branch>;

      const items = await this.branchRepository.find({
        relations: {
          incomePlans: { income_code: true },
          income: { income_code: true },
        },
        where: whereCondition,
      });

      //#region  return object
      const newRes: any = {};
      const allIncomePlans: any[] = [];
      const allIncome: any[] = [];
      items.map((item) => {
        const incomePlans = item.incomePlans.map((incomePlan) => ({
          code: incomePlan.income_code.code,
          amount: Number(incomePlan.amount),
        }));

        const income = item.income.map((income) => ({
          code: income.income_code.code,
          amount: Number(income.amount),
        }));

        if (bcode) {
          newRes.name = item.name;
          newRes.code = item.code;
          newRes.incomePlans = incomePlans.map((m) => m.amount);
          newRes.income = income.map((m) => m.amount);
        } else {
          allIncomePlans.push(incomePlans);
          allIncome.push(income);
          newRes.name = 'All Branch';
          newRes.code = '';
          newRes.incomePlans = [];
          newRes.income = [];
        }
      });

      const [planIncome, incomeCodes] = await Promise.all([
        this.incomePlanRepository.find({
          where: {
            year: year,
          },
        }),
        this.incomeCodeRepository.find(),
      ]);

      newRes.incomeCodes = incomeCodes.map((m) => {
        return {
          code: m.code,
          description: m.description,
        };
      });

      if (planIncome.length === 0) {
        const emptyData = incomeCodes.map((m) => {
          return {
            code: m.code,
            amount: 0,
          };
        });
        newRes.incomePlans = emptyData;
      }

      if (!bcode) {
        newRes.incomePlans = this.flatData(allIncomePlans.flat());
        newRes.income = this.flatData(allIncome.flat());
      }

      newRes.totalIncome = this.calcTotalFunc(newRes.income);
      newRes.totalIncomePlans = this.calcTotalFunc(newRes.incomePlans);

      return newRes ?? {};
    } catch (e) {
      return e.message;
    }
  }

  async incomeAll(date: string) {
    try {
      const queryDate = moment(date).toDate();
      const year = moment(queryDate).year().toString();
      const whereCondition = {
        income: {
          date: queryDate, // Example with date range
        },
        // incomePlans: {
        //   year: year, // Example with date range
        // },
      } as FindOptionsWhere<Branch>;

      const items = await this.branchRepository.find({
        relations: {
          incomePlans: { income_code: true },
          income: { income_code: true },
        },
        where: whereCondition,
      });

      //#region  return array
      const newRes: any[] = [];

      const [planIncome, incomeCodes] = await Promise.all([
        this.incomePlanRepository.find({
          where: {
            year: year,
          },
        }),
        this.incomeCodeRepository.find(),
      ]);

      items.map((item) => {
        const incomePlans = item.incomePlans.map((incomePlan) => ({
          code: incomePlan.income_code.code,
          //date: incomePlan.date,
          amount: Number(incomePlan.amount),
        }));

        const income = item.income.map((income) => ({
          code: income.income_code.code,
          // date: income.date,
          amount: Number(income.amount),
        }));

        const codes = incomeCodes.map((m) => {
          return {
            code: m.code,
            description: m.description,
          };
        });

        const itx = {
          branchName: item.name,
          branchCode: item.code,
          incomePlans: incomePlans.map((m) => m.amount),
          income: income.map((m) => m.amount),
          incomeCodes: codes,
          totalIncome: this.calcTotalFunc(income),
          totalIncomePlans: this.calcTotalFunc(incomePlans),
        };

        newRes.push(itx);
      });

      if (planIncome.length === 0) {
        const emptyData = incomeCodes.map((m) => {
          return {
            code: m.code,
            amount: 0,
          };
        });
        newRes.map((m) => (m.incomePlans = emptyData));
      }

      return newRes ?? [];
      //#endregion
    } catch (e) {
      return e.message;
    }
  }

  // user char 3
  async getPlanProfitDay(data: string, branchId: string) {
    try {
      const myDate = moment(data).format('YYYY-MM-DD');
      const before30Day = moment(myDate).add(-30, 'day').format('YYYY-MM-DD');

      const dateSeriesQuery = `
      WITH RECURSIVE date_series AS (
        SELECT ? AS date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY)
        FROM date_series
        WHERE DATE_ADD(date, INTERVAL 1 DAY) <= ? 
      )
      SELECT 
        ds.date,
        COALESCE(p.branchId, (SELECT MIN(branchId) FROM profit)) as branchId,
        COALESCE(p.profit_amount, 0) as amount
      FROM date_series ds
      LEFT JOIN profit p ON DATE(p.date) = ds.date ${branchId ? 'AND p.branchId = ?' : ''}
      ORDER BY ds.date
    `;

      const [results] = await this.db.query(dateSeriesQuery, [
        before30Day,
        myDate,
        branchId,
      ]);

      const year = moment(myDate).year();
      const queryFindPlanProfit = `select * from profit_plan where year = ? ${branchId ? 'AND branchId = ?' : ''} `;
      const [planTotalPla] = await this.db.query(queryFindPlanProfit, [
        year,
        branchId,
      ]);

      return this.changeResults(results, planTotalPla, branchId, 'day');
    } catch (err) {
      return err.message;
    }
  }

  // user char 3
  async getPlanProfitMonthly(month: string, branchId: string) {
    const currentDate = month ? new Date(month) : new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const monthlyProfitQuery = `
      WITH RECURSIVE month_series AS (
        SELECT DATE_FORMAT(DATE_SUB(?, INTERVAL 6 MONTH), '%Y-%m-01') AS month_start
        UNION ALL
        SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
        FROM month_series
        WHERE DATE_ADD(month_start, INTERVAL 1 MONTH) <= ?
      )
      SELECT 
        ms.month_start AS date,
        COALESCE(p.branchId, (SELECT MIN(branchId) FROM profit)) AS branchId,
        COALESCE(SUM(p.profit_amount), 0) AS amount
      FROM month_series ms
      LEFT JOIN profit p ON DATE_FORMAT(p.date, '%Y-%m-01') = ms.month_start
      ${branchId ? 'AND p.branchId = ?' : ''}
      GROUP BY ms.month_start, p.branchId
      ORDER BY ms.month_start
    `;

    const [results] = await this.db.query(monthlyProfitQuery, [
      formattedDate,
      formattedDate,
      ...(branchId ? [branchId] : []),
    ]);

    const mergeData: { date: string; branchId: number; amount: number }[] = [];

    for (const e of results) {
      const checkItem = mergeData.find((f) => f.date === e.date);

      if (checkItem) {
        checkItem.amount += Number(e.amount);
      } else {
        mergeData.push({
          date: e.date,
          branchId: e.branchId,
          amount: Number(e.amount),
        });
      }
    }

    const year = moment(currentDate).year();
    const queryFindPlanProfit = `select * from profit_plan where year = ? ${branchId ? 'AND branchId = ?' : ''} `;
    const [planTotalPla] = await this.db.query(queryFindPlanProfit, [
      year,
      branchId,
    ]);

    return this.changeResults(results, planTotalPla, branchId, 'month');
  }

  // user char 3
  async getPlanProfitYear(year: number, branchId: string) {
    const currentYear = year || new Date().getFullYear();
    const startYear = currentYear - 3;

    const yearlyProfitQuery = `
      WITH RECURSIVE year_series AS (
        SELECT ? AS year
        UNION ALL
        SELECT year + 1
        FROM year_series
        WHERE year + 1 <= ?
      )
      SELECT 
        ys.year,
        COALESCE(p.branchId, (SELECT MIN(branchId) FROM profit)) AS branchId,
        COALESCE(SUM(p.profit_amount), 0) AS amount
      FROM year_series ys
      LEFT JOIN profit p ON YEAR(p.date) = ys.year
      ${branchId ? 'AND p.branchId = ?' : ''}
      GROUP BY ys.year, p.branchId
      ORDER BY ys.year
    `;

    const [results] = await this.db.query(yearlyProfitQuery, [
      startYear,
      currentYear,
      ...(branchId ? [branchId] : []),
    ]);

    const queryFindPlanProfit = `select * from profit_plan where year = ? ${branchId ? 'AND branchId = ?' : ''} `;
    const [planTotalPla] = await this.db.query(queryFindPlanProfit, [
      year,
      branchId,
    ]);

    return this.changeResults(results, planTotalPla, branchId, 'year');
  }

  // user char 2
  async expense(bcode: string, date: string) {
    const queryDate = moment(date).toDate();
    const year = moment(queryDate).year().toString();

    const whereCondition = {
      code: bcode ? Number(bcode) : null,
      income: {
        date: queryDate, // Example with date range
      },
      expensePlans: {
        year,
      },
    } as FindOptionsWhere<Branch>;

    const items = await this.branchRepository.find({
      relations: {
        expensePlans: { expense_code: true },
        expense: { expense_code: true },
      },
      where: whereCondition,
    });

    const newRes: any = {};
    const allExpensePlans: any[] = [];
    const allExpense: any[] = [];
    items.map((item) => {
      const expensePlans = item.expensePlans.map((expense) => ({
        code: expense.expense_code.code,
        amount: Number(expense.amount),
      }));

      const expenses = item.expense.map((exp) => ({
        code: exp.expense_code.code,
        amount: Number(exp.amount),
      }));

      if (bcode) {
        newRes.name = item.name;
        newRes.code = item.code;
        newRes.expensePlans = expensePlans.map((m) => m.amount);
        newRes.expense = expenses.map((m) => m.amount);
      } else {
        allExpensePlans.push(expensePlans);
        allExpense.push(expenses);
        newRes.name = 'All Branch';
        newRes.code = '';
        newRes.expensePlans = [];
        newRes.expense = [];
      }
    });

    const [planExpense, expensesCode] = await Promise.all([
      this.expensePlanRepository.find({
        where: {
          year: year,
        },
      }),
      this.expenseCodeRepository.find(),
    ]);

    newRes.expenseCodes = expensesCode.map((m) => {
      return {
        code: m.code,
        description: m.description,
      };
    });

    if (planExpense.length === 0) {
      const emptyData = expensesCode.map((m) => {
        return {
          code: m.code,
          amount: 0,
        };
      });
      newRes.expensePlans = emptyData;
    }

    if (!bcode) {
      newRes.expensePlans = this.flatData(allExpensePlans.flat());
      newRes.expense = this.flatData(allExpense.flat());
    }

    newRes.totalExpense = this.calcTotalFunc(newRes.expense);
    newRes.totalExpensePlans = this.calcTotalFunc(newRes.expensePlans);

    return newRes ?? {};
  }

  async expenseAll(date: string) {
    const queryDate = moment(date).toDate();
    const year = moment(queryDate).year().toString();

    const whereCondition = {
      income: {
        date: queryDate, // Example with date range
      },
      expensePlans: {
        year,
      },
    } as FindOptionsWhere<Branch>;

    const items = await this.branchRepository.find({
      relations: {
        expensePlans: { expense_code: true },
        expense: { expense_code: true },
      },
      where: whereCondition,
    });

    const newRes: any[] = [];

    const [planExpense, expensesCode] = await Promise.all([
      this.expensePlanRepository.find({
        where: {
          year: year,
        },
      }),
      this.expenseCodeRepository.find(),
    ]);

    items.map((item) => {
      const expensePlans = item.expensePlans.map((expensePlan) => ({
        code: expensePlan.expense_code.code,
        //date: incomePlan.date,
        amount: Number(expensePlan.amount),
      }));

      const expense = item.expense.map((exp) => ({
        code: exp.expense_code.code,
        // date: income.date,
        amount: Number(exp.amount),
      }));

      const codes = expensesCode.map((m) => {
        return {
          code: m.code,
          description: m.description,
        };
      });

      const itx = {
        branchName: item.name,
        branchCode: item.code,
        expensePlans: expensePlans.map((m) => m.amount),
        expense: expense.map((m) => m.amount),
        expenseCodes: codes,
        totalExpense: this.calcTotalFunc(expense),
        totalExpensePlans: this.calcTotalFunc(expensePlans),
      };
      newRes.push(itx);
    });

    if (planExpense.length === 0) {
      const emptyData = expensesCode.map((m) => {
        return {
          code: m.code,
          amount: 0,
        };
      });

      newRes.map((m) => (m.incomePlans = emptyData));
    }

    return newRes ?? [];
  }

  async importData(file: Express.Multer.File): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const mapData = jsonData.map((m) => {
      return {
        code: m.Branch,
        name: m.nameB,
      };
    });

    return await this.branchRepository.save(mapData);
  }

  private flatData(array: { code: string; amount: number }[]) {
    const myAllPlans: { code: string; amount: number }[] = [];
    array.forEach((e: { code: string; amount: number }) => {
      if (myAllPlans.length === 0) {
        myAllPlans.push({ code: e.code, amount: Number(e.amount) });
      }
      const checkItem = myAllPlans.find((f) => f.code === e.code);

      if (checkItem) {
        checkItem.amount += Number(e.amount);
      } else {
        myAllPlans.push({ code: e.code, amount: Number(e.amount) });
      }
    });

    return myAllPlans.map((m) => Number(m.amount.toFixed(2)));
  }

  private calcTotalFunc(data: any[]): number {
    const total = data.reduce((acc, item) => {
      return acc + Number(item);
    }, 0);
    return total;
  }

  private changeResults(
    data: any,
    planTotalPla: any,
    branchId: string,
    option: 'day' | 'month' | 'year',
  ): { dates: any[]; value: number[]; totalPlanIncome: number } {
    const mergeData: { date: string; branchId: number; amount: number }[] = [];
    for (const e of data) {
      const checkItem = mergeData.find(
        (f) => f.date === (option === 'year' ? e.year : e.date),
      );

      if (checkItem) {
        checkItem.amount += Number(e.amount);
      } else {
        mergeData.push({
          date:
            option === 'year'
              ? e.year
              : option === 'month'
                ? moment(e.data).format('YYYY MMM')
                : moment(e.date).format('YYYY MMM DD'),
          branchId: e.branchId,
          amount: Number(e.amount),
        });
      }
    }

    const dates: any[] = [];
    const value: number[] = [];
    mergeData.forEach((e) => {
      dates.push(e.date);
      value.push(Number(e.amount));
    });

    let totalPlanIncome: number = 0;
    if (branchId) {
      totalPlanIncome =
        planTotalPla.length > 0 ? Number(planTotalPla[0].profit_plan) : 0;
    } else {
      totalPlanIncome =
        planTotalPla.length > 0
          ? planTotalPla
              .map((m) => Number(m.profit_plan))
              .reduce(function (a, b) {
                return a + b;
              })
          : 0;
    }

    return {
      dates,
      value,
      totalPlanIncome,
    };
  }
}
