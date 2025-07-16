import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/entity/income.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as XLSX from 'xlsx';
import { Branch } from 'src/entity/branch.entity';
import { IncomeCode } from 'src/entity/income_code.entity';
import * as moment from 'moment';
import { DatabaseService } from '../../common/database/database.service';
import { IIncome } from '../../common/interfaces/icome.interface';
import { IncomeRes } from '../../common/interfaces/income-res.interface';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { NotFoundError } from 'rxjs';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(IncomeCode)
    private readonly incomeCodeRepository: Repository<IncomeCode>,
    private readonly database: DatabaseService,
  ) {}

  async findIncome(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<IncomeRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_income_dailly(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    return result;
  }

  async findIncomeDailly(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<IncomeRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_income_dailly(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }
    const resultData: IncomeRes = {
      amount: [],
      planAmount: [],
      incomeCOde: [],
      description: [],
      totalPlan: 0,
      totalIncome: 0,
    };

    if (branch !== 'all') {
      result.forEach((e: IIncome) => {
        resultData.amount.push(parseFloat(e.amount));
        resultData.planAmount.push(parseFloat(e.plan_amt));
        resultData.incomeCOde.push(e.income_code);
        resultData.description.push(e.description);
      });
    } else {
      const dataArray = this.sumByIncomeCode(result);
      dataArray.forEach((e) => {
        resultData.amount.push(e.total_amount);
        resultData.planAmount.push(e.total_plan_amt);
        resultData.incomeCOde.push(e.income_code);
        resultData.description.push(e.total_esc);
      });
    }

    resultData.totalPlan = resultData.planAmount.reduce(
      (acc, item) => acc + parseFloat(item),
      0,
    );

    resultData.totalIncome = resultData.amount.reduce(
      (acc, item) => acc + parseFloat(item),
      0,
    );

    return resultData;
  }

  private sumByIncomeCode(data: any[]) {
    const grouped: Record<
      string,
      {
        income_code: string;
        total_plan_amt: number;
        total_amount: number;
        total_esc: string;
      }
    > = {};

    data.forEach((item) => {
      const code = item.income_code;
      const plan = parseFloat(item.plan_amt);
      const amount = parseFloat(item.amount);
      const desc: string = item.description;

      if (!grouped[code]) {
        grouped[code] = {
          income_code: code,
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
