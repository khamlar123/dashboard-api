import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/entity/expense.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Branch } from 'src/entity/branch.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';
import { DatabaseService } from '../../common/database/database.service';
import { IExpense } from '../../common/interfaces/expense.interface';
import { IExpenseRes } from '../../common/interfaces/expense-res.interface';
import { checkCurrentDate } from '../../share/functions/check-current-date';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(ExpenseCode)
    private readonly expenseCodeRepository: Repository<ExpenseCode>,
    private readonly database: DatabaseService,
  ) {}

  async findExpenseDaily(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_expense_dailly(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    const resultData: IExpenseRes = {
      amount: [],
      planAmount: [],
      expenseCOde: [],
      description: [],
      totalPlan: 0,
      totalExpense: 0,
    };

    if (branch !== 'all') {
      result.forEach((e: IExpense) => {
        resultData.amount.push(parseFloat(e.amount));
        resultData.planAmount.push(parseFloat(e.plan_amt));
        resultData.expenseCOde.push(e.expense_code);
        resultData.description.push(e.description);
      });
    } else {
      const dataArray = this.sumByExpenseCode(result);
      dataArray.forEach((e) => {
        resultData.amount.push(e.total_amount);
        resultData.planAmount.push(e.total_plan_amt);
        resultData.expenseCOde.push(e.expense_code);
        resultData.description.push(e.total_esc);
      });
    }

    resultData.totalPlan = resultData.planAmount.reduce(
      (acc, item) => acc + parseFloat(item),
      0,
    );

    resultData.totalExpense = resultData.amount.reduce(
      (acc, item) => acc + parseFloat(item),
      0,
    );

    return resultData;
  }

  private sumByExpenseCode(data: any[]) {
    const grouped: Record<
      string,
      {
        expense_code: string;
        total_plan_amt: number;
        total_amount: number;
        total_esc: string;
      }
    > = {};

    data.forEach((item) => {
      const code = item.expense_code;
      const plan = parseFloat(item.plan_amt);
      const amount = parseFloat(item.amount);
      const desc: string = item.description;

      if (!grouped[code]) {
        grouped[code] = {
          expense_code: code,
          total_plan_amt: 0,
          total_amount: 0,
          total_esc: desc,
        };
      }

      grouped[code].total_plan_amt += plan;
      grouped[code].total_amount += amount;
    });

    return Object.values(grouped);
  }
}
