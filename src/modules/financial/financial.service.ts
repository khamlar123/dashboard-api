import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { IUseFunding } from '../../common/interfaces/use-funding';
import { IUseFundingRes } from '../../common/interfaces/use-funding-res';
import { IProfitRes } from '../../common/interfaces/profit-res';
import { IProfit } from '../../common/interfaces/profit';
import { INplRes } from '../../common/interfaces/npl-res';
import { INpl } from '../../common/interfaces/npl';
import { ILoanBolRes } from '../../common/interfaces/loan-bol-res';
import { ILoanBol } from '../../common/interfaces/loan-bol';
import { reduceFunc } from '../../share/functions/reduce-func';

@Injectable()
export class FinancialService {
  constructor(private readonly database: DatabaseService) {}

  async useFunding(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<IUseFundingRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_use_funding_financial(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    const branches: string[] = [];
    const percents: number[] = [];

    result.forEach((e: IUseFunding) => {
      branches.push(e.name);
      percents.push(+e.percent);
    });

    return {
      tables: result.map((m) => {
        return {
          code: m.code,
          name: m.name,
          use_funding_plan: +m.use_funding_plan,
          loan_balance1: +m.loan_balance1,
          loan_balance2: +m.loan_balance2,
          diff: +m.diff,
          percent: +m.percent,
        };
      }),
      total: {
        total_use_plan: +reduceFunc(
          result.map((m) => +m.use_funding_plan),
        ).toFixed(2),
        total_loan_bal1: +reduceFunc(
          result.map((m) => +m.loan_balance1),
        ).toFixed(2),
        total_loan_bal2: +reduceFunc(
          result.map((m) => +m.loan_balance2),
        ).toFixed(2),
        total_diff: +reduceFunc(result.map((m) => +m.diff)).toFixed(2),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.loan_balance1)) /
            reduceFunc(result.map((m) => +m.use_funding_plan))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    } as IUseFundingRes;
  }

  async profit(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<IProfitRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_financial(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    const branches: string[] = [];
    const percents: number[] = [];

    result.forEach((e: IProfit) => {
      branches.push(e.name);
      percents.push(+e.percent);
    });

    return {
      tables: result.map((m) => {
        return {
          code: m.code,
          name: m.name,
          plan_amt: +m.plan_amt,
          profit1: +m.profit1,
          profit2: +m.profit2,
          diff: +m.diff,
          percent: +m.percent,
        };
      }),
      total: {
        total_plan: +reduceFunc(result.map((m) => +m.plan_amt)).toFixed(2),
        total_profit1: +reduceFunc(result.map((m) => +m.profit1)).toFixed(2),
        total_profit2: +reduceFunc(result.map((m) => +m.profit2)).toFixed(2),
        total_diff: +reduceFunc(result.map((m) => +m.diff)).toFixed(2),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.profit1)) /
            reduceFunc(result.map((m) => +m.plan_amt))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    } as IProfitRes;
  }

  async npl(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<INplRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_npl_financial(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }
    const branches: string[] = [];
    const percents: number[] = [];

    result.forEach((e: INpl) => {
      branches.push(e.name);
      percents.push(+e.percent);
    });

    return {
      tables: result.map((m) => {
        return {
          code: m.code,
          name: m.name,
          npl_plan: +m.npl_plan,
          npl_balance1: +m.npl_balance1,
          npl_balance2: +m.npl_balance2,
          diff: +m.diff,
          percent: +m.percent,
        };
      }),
      total: {
        total_plan: +reduceFunc(result.map((m) => +m.npl_plan)).toFixed(2),
        total_balance1: +reduceFunc(result.map((m) => +m.npl_balance1)).toFixed(
          2,
        ),
        total_balance2: +reduceFunc(result.map((m) => +m.npl_balance2)).toFixed(
          2,
        ),
        total_diff: +reduceFunc(result.map((m) => +m.diff)).toFixed(2),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.npl_balance1)) /
            reduceFunc(result.map((m) => +m.npl_plan))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    } as INplRes;
  }

  async loanBol(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<ILoanBolRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_loan_bol_financial(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }
    const branches: string[] = [];
    const percents: number[] = [];

    result.forEach((e: ILoanBol) => {
      branches.push(e.name);
      percents.push(+e.percent);
    });

    return {
      tables: result.map((m) => {
        return {
          code: m.code,
          name: m.name,
          loan_bol_plan: +m.loan_bol_plan,
          loan_bol1: +m.loan_bol1,
          loan_bol2: +m.loan_bol2,
          diff: +m.diff,
          percent: +m.percent,
        };
      }),
      total: {
        total_plan: +reduceFunc(result.map((m) => +m.loan_bol_plan)).toFixed(2),
        total_bol1: +reduceFunc(result.map((m) => +m.loan_bol1)).toFixed(2),
        total_bol2: +reduceFunc(result.map((m) => +m.loan_bol2)).toFixed(2),
        total_diff: +reduceFunc(result.map((m) => +m.diff)).toFixed(2),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.loan_bol1)) /
            reduceFunc(result.map((m) => +m.loan_bol_plan))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    } as ILoanBolRes;
  }
}
