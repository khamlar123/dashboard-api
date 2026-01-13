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
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from '../../entity/deposit.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { expenseFinancialInterface } from '../../common/interfaces/expense-financial.interface';
import { incomeFinancialInterface } from '../../common/interfaces/income-financial.interface';

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    private readonly database: DatabaseService,
  ) {}

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

    const uniqueByCode = Array.from(
      new Map(result.map((item) => [item.code, item])).values(),
    );

    return {
      tables: uniqueByCode.map((m: any) => {
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
          uniqueByCode.map((m: any) => +m.use_funding_plan),
        ).toFixed(2),
        total_loan_bal1: +reduceFunc(
          uniqueByCode.map((m: any) => +m.loan_balance1),
        ).toFixed(2),
        total_loan_bal2: +reduceFunc(
          uniqueByCode.map((m: any) => +m.loan_balance2),
        ).toFixed(2),
        total_diff: +reduceFunc(uniqueByCode.map((m: any) => +m.diff)).toFixed(
          2,
        ),
        total_percent: +(
          (reduceFunc(uniqueByCode.map((m: any) => +m.loan_balance1)) /
            reduceFunc(uniqueByCode.map((m: any) => +m.use_funding_plan))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    } as IUseFundingRes;
  }

  async funding(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_capital_financial(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    const branches: string[] = [];
    const percents: number[] = [];

    result.forEach((e) => {
      branches.push(e.name);
      percents.push(+e.percent);
    });

    return {
      tables: result.map((m) => {
        return {
          cap_amount1: +m.CAP_AMOUNT1,
          cap_amount2: +m.CAP_AMOUNT2,
          cap_plan: +m.CAP_PLAN,
          code: m.code,
          name: m.name,
          diff: +m.diff,
          percent: +m.percent,
        };
      }),
      total: {
        total_plan: reduceFunc(result.map((m) => +m.CAP_PLAN)),
        total_amount1: reduceFunc(result.map((m) => +m.CAP_AMOUNT1)),
        total_amount2: reduceFunc(result.map((m) => +m.CAP_AMOUNT2)),
        total_diff: reduceFunc(result.map((m) => +m.diff)),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.CAP_AMOUNT1)) /
            reduceFunc(result.map((m) => +m.CAP_PLAN))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    };
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

  async deposit(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_dep_financial(?, ?, ?)`,
      [date, branch ? branch : 'all', option],
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
          dep_plan: +m.dep_plan,
          dep_amount1: +m.dep_amount1,
          dep_amount2: +m.dep_amount2,
          diff: +m.diff,
          percent: +m.percent,
        };
      }),
      total: {
        total_plan: reduceFunc(result.map((m) => +m.dep_plan)),
        total_amount1: reduceFunc(result.map((m) => +m.dep_amount1)),
        total_amount2: reduceFunc(result.map((m) => +m.dep_amount2)),
        total_diff: reduceFunc(result.map((m) => +m.diff)),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.dep_amount1)) /
            reduceFunc(result.map((m) => +m.dep_plan))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    };
  }

  async compareIncome(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_acc_income_comp_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupDataByDate(result, 'income', option);
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_acc_income_comp_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupDataByDate(result, 'income', option);
    }

    const dates: string[] = [];
    const amount: number[] = [];
    const plan: number[] = [];

    groupData.forEach((e) => {
      dates.push(e.monthend);
      amount.push(e.amount);
      plan.push(e.plan_amount);
    });

    return {
      dates: dates,
      amount: amount,
      plan: plan,
    };
  }

  async compareExpense(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_acc_expense_comp_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupDataByDate(result, 'expense', option);
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_acc_expense_comp_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupDataByDate(result, 'expense', option);
    }

    const dates: string[] = [];
    const amount: number[] = [];
    const plan: number[] = [];

    groupData.forEach((e) => {
      dates.push(e.monthend);
      amount.push(e.amount);
      plan.push(e.plan_amount);
    });

    return {
      dates: dates,
      amount: amount,
      plan: plan,
    };
  }

  async compareProfit(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_acc_profit_comp_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupDataByDate(result, 'profit', option);
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_acc_profit_comp_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupDataByDate(result, 'profit', option);
    }

    const dates: string[] = [];
    const amount: number[] = [];
    const plan: number[] = [];

    groupData.forEach((e) => {
      dates.push(e.monthend);
      amount.push(e.amount);
      plan.push(e.plan_amount);
    });

    return {
      dates: dates,
      amount: amount,
      plan: plan,
    };
  }

  async incomeCompareIncome(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_acc_income_comp_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupDataByDate(result, 'income', option);
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_acc_income_comp_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupDataByDate(result, 'income', option);
    }

    const currentMonth = groupData[groupData.length - 1];

    let resx;
    if (option === 'm') {
      //month_to_month
      const findPlan =
        (currentMonth.plan_amount / 12) * Number(moment(date).format('MM'));
      const calcProfitMonthToMonth: number = Number(
        ((currentMonth.amount / findPlan) * 100).toFixed(2),
      );

      //month_to_last_month
      const beforeMonth = groupData[groupData.length - 2];
      const calcMonthToLastMonth = Number(
        ((currentMonth.amount / beforeMonth.amount) * 100).toFixed(2),
      );

      //
      const [findBefore] = await this.database.query(
        `call proc_acc_comp_monthly(?, ?)`,
        [date, branch],
      );
      const beforeYearThisMouth = this.groupByTypeAndBrand(
        findBefore,
        'income',
      );
      const calcMonthToLastYearThisMonth = Number(
        ((currentMonth.amount / beforeYearThisMouth) * 100).toFixed(2),
      );

      resx = {
        month_to_month: {
          amount: currentMonth.amount,
          beforeAmount: findPlan,
          precent: calcProfitMonthToMonth,
        },
        month_to_last_month: {
          amount: currentMonth.amount,
          beforeAmount: beforeYearThisMouth,
          precent: calcMonthToLastMonth,
        },
        month_to_last_year_month: {
          amount: currentMonth.amount,
          beforeAmount: beforeYearThisMouth,
          precent: calcMonthToLastYearThisMonth,
        },
      };
    } else {
      console.log('groupData', groupData);

      const before2yearAmount = groupData[0].amount;
      const before2yearPlan = groupData[0].plan_amount;

      const before1yearAmount = groupData[1].amount;
      const before1yearPlan = groupData[1].plan_amount;

      const currentYearAmount = groupData[2].amount;
      const currentYearPlan = groupData[2].plan_amount;

      resx = {
        month_to_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before2yearAmount && before1yearAmount
              ? +((before1yearAmount / before2yearAmount) * 100).toFixed(2)
              : 0,
        },
        month_to_last_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before1yearAmount && before1yearPlan
              ? +((before1yearAmount / before1yearPlan) * 100).toFixed(2)
              : 0,
        },
        month_to_last_year_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before1yearAmount && currentYearPlan
              ? +((before1yearAmount / currentYearPlan) * 100).toFixed(2)
              : 0,
        },
      };
    }

    return resx;
  }

  async expenseCompareExpense(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_acc_expense_comp_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupDataByDate(result, 'expense', option);
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_acc_expense_comp_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupDataByDate(result, 'expense', option);
    }

    const currentMonth = groupData[groupData.length - 1];

    let resx;

    if (option === 'm') {
      const findPlan =
        (currentMonth.plan_amount / 12) * Number(moment(date).format('MM'));
      const calcProfitMonthToMonth: number = Number(
        ((currentMonth.amount / findPlan) * 100).toFixed(2),
      );

      //month_to_last_month
      const beforeMonth = groupData[groupData.length - 2];
      const calcMonthToLastMonth = Number(
        ((currentMonth.amount / beforeMonth.amount) * 100).toFixed(2),
      );

      //
      const [findBefore] = await this.database.query(
        `call proc_acc_comp_monthly(?, ?)`,
        [date, branch],
      );
      const beforeYearThisMouth = this.groupByTypeAndBrand(
        findBefore,
        'expense',
      );
      const calcMonthToLastYearThisMonth = Number(
        ((currentMonth.amount / beforeYearThisMouth) * 100).toFixed(2),
      );

      resx = {
        month_to_month: {
          amount: currentMonth.amount,
          beforeAmount: findPlan,
          precent: calcProfitMonthToMonth,
        },
        month_to_last_month: {
          amount: currentMonth.amount,
          beforeAmount: beforeMonth.amount,
          precent: calcMonthToLastMonth,
        },
        month_to_last_year_month: {
          amount: currentMonth.amount,
          beforeAmount: beforeYearThisMouth,
          precent: calcMonthToLastYearThisMonth,
        },
      };
    } else {
      const before2yearAmount = groupData[0].amount;
      const before2yearPlan = groupData[0].plan_amount;

      const before1yearAmount = groupData[1].amount;
      const before1yearPlan = groupData[1].plan_amount;

      const currentYearAmount = groupData[2].amount;
      const currentYearPlan = groupData[2].plan_amount;

      resx = {
        month_to_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before2yearAmount && before1yearAmount
              ? +((before1yearAmount / before2yearAmount) * 100).toFixed(2)
              : 0,
        },
        month_to_last_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before1yearAmount && before1yearPlan
              ? +((before1yearAmount / before1yearPlan) * 100).toFixed(2)
              : 0,
        },
        month_to_last_year_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before1yearAmount && currentYearPlan
              ? +((before1yearAmount / currentYearPlan) * 100).toFixed(2)
              : 0,
        },
      };
    }

    return resx;
  }

  async profitCompareProfit(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_acc_profit_comp_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupDataByDate(result, 'profit', option);
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_acc_profit_comp_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupDataByDate(result, 'profit', option);
    }

    const currentMonth = groupData[groupData.length - 1];

    let resx;

    if (option === 'm') {
      const findPlan =
        (currentMonth.plan_amount / 12) * Number(moment(date).format('MM'));
      const calcProfitMonthToMonth: number = Number(
        ((currentMonth.amount / findPlan) * 100).toFixed(2),
      );

      //month_to_last_month
      const beforeMonth = groupData[groupData.length - 2];
      const calcMonthToLastMonth = Number(
        ((currentMonth.amount / beforeMonth.amount) * 100).toFixed(2),
      );

      //
      const [findBefore] = await this.database.query(
        `call proc_acc_comp_monthly(?, ?)`,
        [date, branch],
      );
      const beforeYearThisMouth = this.groupByTypeAndBrand(
        findBefore,
        'expense',
      );
      const calcMonthToLastYearThisMonth = Number(
        ((currentMonth.amount / beforeYearThisMouth) * 100).toFixed(2),
      );

      resx = {
        month_to_month: {
          amount: currentMonth.amount,
          beforeAmount: findPlan,
          precent: calcProfitMonthToMonth,
        },
        month_to_last_month: {
          amount: currentMonth.amount,
          beforeAmount: beforeMonth.amount,
          precent: calcMonthToLastMonth,
        },
        month_to_last_year_month: {
          amount: currentMonth.amount,
          beforeAmount: beforeYearThisMouth,
          precent: calcMonthToLastYearThisMonth,
        },
      };
    } else {
      const before2yearAmount = groupData[0].amount;
      const before2yearPlan = groupData[0].plan_amount;

      const before1yearAmount = groupData[1].amount;
      const before1yearPlan = groupData[1].plan_amount;

      const currentYearAmount = groupData[2].amount;
      const currentYearPlan = groupData[2].plan_amount;

      resx = {
        month_to_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before2yearAmount && before1yearAmount
              ? +((before1yearAmount / before2yearAmount) * 100).toFixed(2)
              : 0,
        },
        month_to_last_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before1yearAmount && before1yearPlan
              ? +((before1yearAmount / before1yearPlan) * 100).toFixed(2)
              : 0,
        },
        month_to_last_year_month: {
          amount: currentYearAmount,
          beforeAmount: currentYearPlan,
          precent:
            before1yearAmount && currentYearPlan
              ? +((before1yearAmount / currentYearPlan) * 100).toFixed(2)
              : 0,
        },
      };
    }

    return resx;
  }

  async expense(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_expense_financial (?, ?, ?)`,
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
          expense_amt1: +m.expense_amt1,
          expense_amt2: +m.expense_amt2,
          diff: +m.diff,
          percent: +m.percent,
        };
      }),
      total: {
        total_plan: +reduceFunc(result.map((m) => +m.plan_amt)).toFixed(2),
        total_expense_amt1: +reduceFunc(
          result.map((m) => +m.expense_amt1),
        ).toFixed(2),
        total_expense_amt2: +reduceFunc(
          result.map((m) => +m.expense_amt2),
        ).toFixed(2),
        total_diff: +reduceFunc(result.map((m) => +m.diff)).toFixed(2),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.expense_amt1)) /
            reduceFunc(result.map((m) => +m.plan_amt))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    } as expenseFinancialInterface;
  }

  async income(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_income_financial (?, ?, ?)`,
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
          income_amt1: +m.income_amt1,
          income_amt2: +m.income_amt2,
          diff: +m.diff,
          percent: +m.percent,
        };
      }),
      total: {
        total_plan: +reduceFunc(result.map((m) => +m.plan_amt)).toFixed(2),
        total_income_amt1: +reduceFunc(
          result.map((m) => +m.income_amt1),
        ).toFixed(2),
        total_income_amt2: +reduceFunc(
          result.map((m) => +m.income_amt2),
        ).toFixed(2),
        total_diff: +reduceFunc(result.map((m) => +m.diff)).toFixed(2),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.income_amt1)) /
            reduceFunc(result.map((m) => +m.plan_amt))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    } as incomeFinancialInterface;
  }

  private groupDataByDate(
    data: any[],
    type: 'income' | 'expense' | 'profit',
    option: 'm' | 'y',
  ) {
    const grouped: Record<
      string,
      {
        monthend: string;
        plan_amount: number;
        amount: number;
      }
    > = {};

    data.forEach((e) => {
      const monthend =
        option === 'm'
          ? moment(e.monthend).format('YYYYMM')
          : moment(type === 'expense' ? e.yearend : e.monthend).format('YYYY');
      const plan_amount = +e.plan_amt;
      const amount =
        type === 'income'
          ? +e.income_amt
          : type === 'expense'
            ? +e.income_amt
            : +e.profit;

      if (!grouped[monthend]) {
        grouped[monthend] = {
          monthend: monthend,
          plan_amount: 0,
          amount: 0,
        };
      }

      grouped[monthend].plan_amount += plan_amount;
      grouped[monthend].amount += amount;
    });
    return Object.values(grouped);
  }

  private groupByTypeAndBrand(
    data: any[],
    type: 'income' | 'expense' | 'profit',
  ) {
    return reduceFunc(
      data.filter((f) => f.types === type).map((m) => +m.last_year_inamt),
    );
  }
}
