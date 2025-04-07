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
          newRes.incomePlans = incomePlans;
          newRes.income = income;
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

        const itx = {
          branchName: item.name,
          branchCode: item.code,
          incomePlans,
          income,
        };

        newRes.push(itx);
      });

      const [planIncome, incomeCodes] = await Promise.all([
        this.incomePlanRepository.find({
          where: {
            year: year,
          },
        }),
        this.incomeCodeRepository.find(),
      ]);

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
        newRes.expensePlans = expensePlans;
        newRes.expense = expenses;
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

      const itx = {
        branchName: item.name,
        branchCode: item.code,
        expensePlans,
        expense,
      };
      newRes.push(itx);
    });

    const [planExpense, expensesCode] = await Promise.all([
      this.expensePlanRepository.find({
        where: {
          year: year,
        },
      }),
      this.expenseCodeRepository.find(),
    ]);

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

    return myAllPlans;
  }
}
