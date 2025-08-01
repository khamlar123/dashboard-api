import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../../entity/loan.entity';
import { Branch } from '../../entity/branch.entity';
import { LoanPlan } from '../../entity/loan_plan.entity';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import * as moment from 'moment';
import { reduceFunc } from '../../share/functions/reduce-func';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(LoanPlan)
    private readonly loanPlanRepository: Repository<LoanPlan>,
    private readonly db: DatabaseService,
    private readonly databaseService: DatabaseService,
  ) {}

  async loanPlan(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'yearly');
    }

    const plan: number[] = [];
    const balance: number[] = [];
    const npl: number[] = [];
    const dateX: string[] = [];

    groupData.forEach((e) => {
      plan.push(e.loan_plan);
      balance.push(e.balance);
      npl.push(e.npl_balance);
      dateX.push(e.date);
    });

    return {
      plan: plan,
      balance: balance,
      npl: npl,
      date: dateX,
    };
  }

  async planNpl(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'yearly');
    }

    const plan: number[] = [];
    const npl: number[] = [];
    const dateX: string[] = [];

    groupData.forEach((e) => {
      plan.push(e.npl_plan);
      npl.push(e.npl_balance);
      dateX.push(e.date);
    });

    return {
      plan: plan,
      npl: npl,
      date: dateX,
    };
  }

  async loanCredits(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'yearly');
    }

    const app_amount: number[] = [];
    const dateX: string[] = [];

    groupData.forEach((e) => {
      app_amount.push(e.app_amount);
      dateX.push(e.date);
    });

    return {
      amount: app_amount,
      date: dateX,
    };
  }

  async allLoan(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'yearly');
    }

    const names: string[] = [];
    const npl: number[] = [];
    const pl: number[] = [];

    groupData.forEach((e) => {
      names.push(e.name);
      npl.push(e.npl_balance);
      pl.push(e.balance - e.npl_balance);
    });

    return {
      name: names,
      npl: npl,
      pl: pl,
    };
  }

  async classA(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'yearly');
    }

    const dateX: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      dateX.push(e.date);
      amount.push(e.classA);
    });

    return {
      date: dateX,
      amount: amount,
    };
  }

  async classB(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'yearly');
    }

    const dateX: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      dateX.push(e.date);
      amount.push(e.classB);
    });

    return {
      date: dateX,
      amount: amount,
    };
  }

  async classCDE(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'yearly');
    }

    const dateX: string[] = [];
    const amountC: number[] = [];
    const amountD: number[] = [];
    const amountE: number[] = [];

    groupData.forEach((e) => {
      dateX.push(e.date);
      amountC.push(e.classC);
      amountD.push(e.classD);
      amountE.push(e.classE);
    });

    return {
      date: dateX,
      amountC: amountC,
      amountD: amountD,
      amountE: amountE,
    };
  }

  async allClass(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'yearly');
    }

    const names: string[] = [];
    const amountB: number[] = [];
    const amountC: number[] = [];
    const amountD: number[] = [];
    const amountE: number[] = [];

    groupData.forEach((e) => {
      names.push(e.name);
      amountB.push(e.classB);
      amountC.push(e.classC);
      amountD.push(e.classD);
      amountE.push(e.classE);
    });

    return {
      names: names,
      amountB: amountB,
      amountC: amountC,
      amountD: amountD,
      amountE: amountE,
    };
  }

  async period(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'yearly');
    }

    const dateX: string[] = [];
    const short: number[] = [];
    const middle: number[] = [];
    const longs: number[] = [];

    groupData.forEach((e) => {
      dateX.push(e.date);
      short.push(e.short);
      middle.push(e.middle);
      longs.push(e.longs);
    });

    return {
      date: dateX,
      short: short,
      middle: middle,
      longs: longs,
    };
  }

  async sumPeriod(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDate(result, 'yearly');
    }

    const short: number[] = [];
    const middle: number[] = [];
    const longs: number[] = [];

    groupData.forEach((e) => {
      short.push(e.short);
      middle.push(e.middle);
      longs.push(e.longs);
    });

    return {
      short: reduceFunc(short),
      middle: reduceFunc(middle),
      longs: reduceFunc(longs),
    };
  }

  async allPeriod(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.databaseService.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByBranch(result, 'yearly');
    }

    const name: string[] = [];
    const shortAmount: number[] = [];
    const middleAmount: number[] = [];
    const longAmount: number[] = [];
    groupData.forEach((e) => {
      name.push(e.name);
      shortAmount.push(e.short);
      middleAmount.push(e.middle);
      longAmount.push(e.longs);
    });

    return {
      name: name,
      shortAmount: shortAmount,
      middleAmount: middleAmount,
      longAmount: longAmount,
    };
  }

  async loanSector(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    const [result] = await this.databaseService.query(
      `call proc_ln_plan_sector_daily(?, ?, ?)`,
      [date, branch, option],
    );

    const groupData = this.groupByCode(result);

    const name: string[] = [];
    const amount: number[] = [];
    const plan: number[] = [];

    groupData.forEach((e) => {
      name.push(e.description);
      amount.push(e.sector_balance);
      plan.push(e.sector_plan_amount);
    });

    return {
      name: name,
      amount: amount,
      plan: plan,
    };
  }

  async allLoanSector(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    const [result] = await this.databaseService.query(
      `call proc_ln_plan_sector_daily(?, ?, ?)`,
      [date, branch, option],
    );
    const groupData = this.sectorGroupByBranch(result);

    const branchList: string[] = [];
    const amount: number[] = [];
    const plan: number[] = [];

    groupData.forEach((e) => {
      branchList.push(e.name);
      amount.push(e.sector_balance);
      plan.push(e.sector_plan_amount);
    });

    return {
      branch: branchList,
      amount: amount,
      plan: plan,
    };
  }

  private groupByDate(data: any[], option: 'daily' | 'monthly' | 'yearly') {
    const grouped: Record<
      string,
      {
        date: string;
        loan_plan: number;
        balance: number;
        npl_balance: number;
        npl_plan: number;
        app_amount: number;
        classA: number;
        classB: number;
        classC: number;
        classD: number;
        classE: number;
        short: number;
        middle: number;
        longs: number;
      }
    > = {};

    data.forEach((e) => {
      const date =
        option === 'daily'
          ? e.date
          : option === 'monthly'
            ? moment(e.monthend).format('YYYYMM')
            : moment(e.monthend).format('YYYY');
      const loan_plan = +e.loan_plan;
      const balance = +e.balance;
      const npl = +e.npl_balance;
      const npl_plan = +e.npl_plan;
      const app_amount = +e.app_amount;
      const classA = +e.classA;
      const classB = +e.classB;
      const classC = +e.classC;
      const classD = +e.classD;
      const classE = +e.classE;
      const short = +e.short;
      const middle = +e.middle;
      const longs = +e.longs;
      if (!grouped[date]) {
        grouped[date] = {
          date:
            option === 'daily'
              ? date
              : option === 'monthly'
                ? moment(date).format('YYYYMM').toString()
                : moment(date).format('YYYY'),
          loan_plan: 0,
          balance: 0,
          npl_balance: 0,
          npl_plan: 0,
          app_amount: 0,
          classA: 0,
          classB: 0,
          classC: 0,
          classD: 0,
          classE: 0,
          short: 0,
          middle: 0,
          longs: 0,
        };
      }
      grouped[date].loan_plan += loan_plan;
      grouped[date].balance += balance;
      grouped[date].npl_balance += npl;
      grouped[date].npl_plan += npl_plan;
      grouped[date].app_amount += app_amount;
      grouped[date].classA += classA;
      grouped[date].classB += classB;
      grouped[date].classC += classC;
      grouped[date].classD += classD;
      grouped[date].classE += classE;
      grouped[date].short += short;
      grouped[date].middle += middle;
      grouped[date].longs += longs;
    });
    return Object.values(grouped);
  }

  private groupByBranch(data: any[], option: 'daily' | 'monthly' | 'yearly') {
    const grouped: Record<
      string,
      {
        date: string;
        loan_plan: number;
        balance: number;
        npl_balance: number;
        npl_plan: number;
        app_amount: number;
        branch: number;
        name: string;
        classA: number;
        classB: number;
        classC: number;
        classD: number;
        classE: number;
        short: number;
        middle: number;
        longs: number;
      }
    > = {};

    data.forEach((e) => {
      const code = e.code;
      const date =
        option === 'daily'
          ? e.date
          : option === 'monthly'
            ? e.monthend
            : e.monthend;
      const loan_plan = +e.loan_plan;
      const balance = +e.balance;
      const npl = +e.npl_balance;
      const npl_plan = +e.npl_plan;
      const app_amount = +e.app_amount;
      const classA = +e.classA;
      const classB = +e.classB;
      const classC = +e.classC;
      const classD = +e.classD;
      const classE = +e.classE;
      const short = +e.short;
      const middle = +e.middle;
      const longs = +e.longs;

      if (!grouped[code]) {
        grouped[code] = {
          branch: code,
          name: e.name,
          date:
            option === 'daily'
              ? date
              : option === 'monthly'
                ? moment(date).format('YYYYMM').toString()
                : moment(date).format('YYYY'),
          loan_plan: 0,
          balance: 0,
          npl_balance: 0,
          npl_plan: 0,
          app_amount: 0,
          classA: 0,
          classB: 0,
          classC: 0,
          classD: 0,
          classE: 0,
          short: 0,
          middle: 0,
          longs: 0,
        };
      }
      grouped[code].loan_plan += loan_plan;
      grouped[code].balance += balance;
      grouped[code].npl_balance += npl;
      grouped[code].npl_plan += npl_plan;
      grouped[code].app_amount += app_amount;
      grouped[code].classA += classA;
      grouped[code].classB += classB;
      grouped[code].classC += classC;
      grouped[code].classD += classD;
      grouped[code].classE += classE;
      grouped[code].short += short;
      grouped[code].middle += middle;
      grouped[code].longs += longs;
    });

    return Object.values(grouped);
  }

  private groupByCode(data: any[]) {
    const grouped: Record<
      string,
      {
        code: number;
        name: string;
        date: string;
        sector_plan_amount: number;
        sector_balance: number;
        sector_code: string;
        description: string;
      }
    > = {};

    data.forEach((e) => {
      const sector_code = e.sector_code;
      const sector_plan_amount = +e.sector_plan_amount;
      const sector_balance = +e.sector_balance;
      if (!grouped[sector_code]) {
        grouped[sector_code] = {
          code: e.code,
          name: e.name,
          date: e.date,
          sector_plan_amount: 0,
          sector_balance: 0,
          sector_code: sector_code,
          description: e.description,
        };
      }

      grouped[sector_code].sector_plan_amount += sector_plan_amount;
      grouped[sector_code].sector_balance += sector_balance;
    });

    return Object.values(grouped);
  }

  private sectorGroupByBranch(data: any[]) {
    const grouped: Record<
      string,
      {
        code: number;
        name: string;
        date: string;
        sector_plan_amount: number;
        sector_balance: number;
        sector_code: string;
        description: string;
      }
    > = {};

    data.forEach((e) => {
      const branch = e.code;
      const sector_code = e.sector_code;
      const sector_plan_amount = +e.sector_plan_amount;
      const sector_balance = +e.sector_balance;
      if (!grouped[branch]) {
        grouped[branch] = {
          code: branch,
          name: e.name,
          date: e.date,
          sector_plan_amount: 0,
          sector_balance: 0,
          sector_code: sector_code,
          description: e.description,
        };
      }

      grouped[branch].sector_plan_amount += sector_plan_amount;
      grouped[branch].sector_balance += sector_balance;
    });

    return Object.values(grouped);
  }
}
