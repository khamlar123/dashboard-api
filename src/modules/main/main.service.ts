import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { reduceFunc } from '../../share/functions/reduce-func';
import * as moment from 'moment';
import { sortFunc } from '../../share/functions/sort-func';
type Capital = {
  date: string;
  Asset_plan: string;
  Asset: string;
  Liability_plan: string;
  Liability: string;
  Capital_plan: string;
  Capital: string;
};

type Profit = {
  code: number;
  name: string;
  monthend: string;
  plan_amt: string;
  profit: string;
};

interface Deposit {
  code: number;
  name: string;
  monthend: string;
  ccy: string;
  dep_type_desc: string;
  dep_desc: string;
  cdcbal: string;
  cdcballak: string;
}

type Loan = {
  code: number;
  name: string;
  monthend: string;
  loan_plan: string;
  balance: string;
  npl_plan: string;
  npl_balance: string;
  app_amount: string;
  classA: string;
  classB: string;
  classC: string;
  classD: string;
  classE: string;
  short: string;
  middle: string;
  longs: string;
};

@Injectable()
export class MainService {
  constructor(private readonly database: DatabaseService) {}

  async group1(date: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [date]);

    const dates: string[] = [];
    const Asset_plan: string[] = [];
    const Asset: string[] = [];
    const Liability_plan: string[] = [];
    const Liability: string[] = [];
    const Capital_plan: string[] = [];
    const Capital: string[] = [];

    result.forEach((e) => {
      dates.push(e.date);
      Asset_plan.push(e.Asset_plan);
      Asset.push(e.Asset);
      Liability_plan.push(e.Liability_plan);
      Liability.push(e.Liability);
      Capital_plan.push(e.Capital_plan);
      Capital.push(e.Capital);
    });

    return {
      dates,
      Asset_plan,
      Asset,
      Liability_plan,
      Liability,
      Capital_plan,
      Capital,
    };
  }

  async group2(date: string): Promise<any> {
    checkCurrentDate(date);
    const [[income], [expense], [profit]] = await Promise.all([
      this.database.query(`call proc_income_financial(?, ?, ?)`, [
        date,
        'ALL',
        'M',
      ]),
      this.database.query(`call proc_expense_financial(?, ?, ?)`, [
        date,
        'ALL',
        'M',
      ]),
      this.database.query(`call proc_profit_financial(?, ?, ?)`, [
        date,
        'ALL',
        'M',
      ]),
    ]);

    const incomeList: number[] = income.map((m) => Number(m.income_amt1));
    const expenseList: number[] = expense.map((m) => Number(m.expense_amt1));
    const profitList: number[] = profit.map((m) => Number(m.profit1));
    const incomePlanList: number[] = income.map((m) => Number(m.plan_amt));
    const expensePlanList: number[] = expense.map((m) => Number(m.plan_amt));
    const profitPlanList: number[] = profit.map((m) => Number(m.plan_amt));
    const name: string[] = income.map((m) => m.name);

    const sumary = {
      totalIncome: reduceFunc(incomeList),
      incomePercent: +(
        (reduceFunc(incomeList) / reduceFunc(incomePlanList)) *
        100
      ).toFixed(2),

      totalExpense: reduceFunc(expenseList),
      expensePercent: +(
        (reduceFunc(expenseList) / reduceFunc(expensePlanList)) *
        100
      ).toFixed(2),

      totalProfit: reduceFunc(profitList),
      profitPercent: +(
        (reduceFunc(profitList) / reduceFunc(profitPlanList)) *
        100
      ).toFixed(2),
    };

    return {
      name: name,
      income: incomeList,
      expense: expenseList,
      profit: profitList,
      sumary: sumary,
    };
  }

  async group3(date: string): Promise<any> {
    checkCurrentDate(date);
    const [[capital], [use_funding]] = await Promise.all([
      this.database.query(`call  proc_capital_financial(?, ?, ?)`, [
        date,
        'ALL',
        'M',
      ]),
      this.database.query(`call proc_use_funding_financial(?, ?, ?)`, [
        date,
        'ALL',
        'M',
      ]),
    ]);

    const name: string[] = [];

    const capitalList: number[] = [];
    const capPlan: number[] = [];
    const capitalBeforeList: number[] = [];

    const use_fundingList: number[] = [];
    const useFundingBeforeList: number[] = [];
    const useFundPlan: number[] = [];

    capital.forEach((e) => {
      name.push(e.name);
      capitalList.push(Number(e.CAP_AMOUNT1));
      capPlan.push(Number(e.CAP_PLAN));
      capitalBeforeList.push(Number(e.CAP_AMOUNT2));
    });

    use_funding.forEach((e) => {
      use_fundingList.push(Number(e.loan_balance1));
      useFundPlan.push(Number(e.use_funding_plan));
      useFundingBeforeList.push(Number(e.loan_balance2));
    });

    const sumCapCurrent: number = reduceFunc(capitalList);
    const sumCapBefore: number = reduceFunc(capitalBeforeList);
    const sumCapPlan: number = reduceFunc(capPlan);
    const sumUseFundCurrent: number = reduceFunc(use_fundingList);
    const sumUseFundBefore: number = reduceFunc(useFundingBeforeList);
    const sumUseFundPlan: number = reduceFunc(useFundPlan);

    return {
      name,
      capitalList,
      use_fundingList,
      summary: {
        totalCapital: sumCapCurrent,
        comparePercent: +((sumCapBefore / sumCapPlan) * 100),
        totalUseFunding: sumUseFundCurrent,
        useFundingPercent: +((sumUseFundBefore / sumUseFundPlan) * 100),
      },
    };
  }

  async group4(date: string): Promise<any> {
    checkCurrentDate(date);

    const [[nops], [profits], [capitals], [deposit], [loan]] =
      await Promise.all([
        this.database.query(`call proc_main_nop_all(?)`, [date]),
        this.database.query(`call proc_profit_monthly(?, ?)`, [date, 'ALL']),
        this.database.query(`call   proc_main_ACL(?)`, [date]),
        this.database.query(`call proc_treasury_dep_monthly(?, ?)`, [
          date,
          'ALL',
        ]),
        this.database.query(`call  proc_ln_plan_bal_npl_monthly(?, ?)`, [
          date,
          'ALL',
        ]),
      ]);

    const dates: string[] = sortFunc(nops, 'new_date', 'min').map(
      (m) => m.new_date,
    );

    const nopList: number[] = sortFunc(nops, 'new_date', 'min').map((m) =>
      Number(m.nopall),
    );
    const roeList: number[] = this.getCapitalProfitRatios(
      sortFunc(capitals, 'date', 'min'),
      sortFunc(profits, 'monthend', 'min'),
      'cap',
    );
    const roaList: number[] = this.getCapitalProfitRatios(
      sortFunc(capitals, 'date', 'min'),
      sortFunc(profits, 'monthend', 'min'),
      'ass',
    );

    const myDeposit = this.sumDepositByDate(
      sortFunc(deposit, 'monthend', 'min'),
    );
    const myLoan = this.sumLoanByDate(sortFunc(loan, 'monthend', 'min'));

    const ldrList = this.calculateRatios(myDeposit, myLoan).map((m) => m.ratio);

    return {
      data: dates,
      nopList,
      roeList,
      roaList,
      ldrList,
      lastItem: {
        nop: nopList[nopList.length - 1],
        roe: roeList[roeList.length - 1],
        roa: roaList[roaList.length - 1],
        ldr: ldrList[ldrList.length - 1],
      },
    };
  }

  async group5(date: string): Promise<any> {
    checkCurrentDate(date);
    const [npl] = await this.database.query(
      `call proc_ln_plan_bal_npl_monthly(?, ?)`,
      [date, 'ALL'],
    );

    const getLastDay = npl.slice(0, 18);

    const label: string[] = [];
    const value: number[] = [];

    getLastDay.forEach((d) => {
      label.push(d.name);
      value.push(Number(d.npl_balance));
    });

    const summary = this.getSummary(getLastDay);
    const calcPl = summary.sum_balance - summary.sum_npl_balance;
    const total = +(calcPl + summary.sum_npl_balance).toFixed(2);

    const formatted = {
      pl: +calcPl.toFixed(2),
      pl_percent: +((calcPl / total) * 100).toFixed(2),
      sum_npl: parseFloat(summary.sum_npl_balance.toFixed(2)),
      npl_percent: +((summary.sum_npl_balance / total) * 100).toFixed(2),
    };

    return {
      label,
      value,
      summary: formatted,
    };
  }

  async group6(date: string): Promise<any> {
    checkCurrentDate(date);

    const [[deposit], [treasury]] = await Promise.all([
      this.database.query(`call proc_dep_financial(?, ?, ?)`, [
        date,
        'ALL',
        'M',
      ]),
      this.database.query(`call proc_treasury_dep_monthly(?, ?)`, [
        date,
        'ALL',
      ]),
    ]);

    const name: string[] = [];
    const deposits: number[] = [];
    const plans: number[] = [];

    deposit.forEach((d) => {
      name.push(d.name);
      deposits.push(Number(d.dep_amount1));
      plans.push(Number(d.dep_plan));
    });

    const filterLastItems: any[] = treasury.filter(
      (f) =>
        moment(f.monthend).format('YYYYMM') === moment(date).format('YYYYMM'),
    );

    const grouped = filterLastItems.reduce<Record<string, number>>(
      (acc, item) => {
        const key = item.dep_type_desc;
        const value = parseFloat(item.cdcballak);

        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += value;
        return acc;
      },
      {},
    );

    // 2) Get total
    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

    // 3) Build final object with % and value
    const result: Record<string, { value: number; percent: number }> = {};
    for (const key in grouped) {
      result[key] = {
        value: parseFloat(grouped[key].toFixed(2)),
        percent: parseFloat(((grouped[key] / total) * 100).toFixed(2)),
      };
    }

    return {
      name,
      deposits,
      plans,
      deposit_type: result,
    };
  }

  private getCapitalProfitRatios(
    capitals: Capital[],
    profits: any[],
    option: 'cap' | 'ass',
  ): number[] {
    return capitals.map((cap) => {
      // sum all profit for the same date
      const totalProfit = profits
        .filter((p) => p.monthend === cap.date)
        .reduce((sum, p) => sum + parseFloat(p.profit), 0);

      const capital =
        option === 'cap' ? parseFloat(cap.Capital) : parseFloat(cap.Asset);

      if (totalProfit === 0) return 0; // avoid division by zero
      return Number(((totalProfit / capital) * 100).toFixed(2));
    });
  }

  private sumDepositByDate(data: any[]) {
    const grouped: Record<
      string,
      {
        monthend: string;
        balance: number;
      }
    > = {};

    data.forEach((e) => {
      const monthend = e.monthend;
      const balance = e.cdcballak;

      if (!grouped[monthend]) {
        grouped[monthend] = {
          monthend: e.monthend,
          balance: 0,
        };
      }

      grouped[monthend].balance += Number(balance);
    });
    return Object.values(grouped);
  }

  private sumLoanByDate(data: any[]) {
    const grouped: Record<
      string,
      {
        monthend: string;
        balance: number;
      }
    > = {};

    data.forEach((e) => {
      const monthend = e.monthend;
      const balance = e.balance;

      if (!grouped[monthend]) {
        grouped[monthend] = {
          monthend: e.monthend,
          balance: 0,
        };
      }

      grouped[monthend].balance += Number(balance);
    });
    return Object.values(grouped);
  }

  private calculateRatios(deposits: any, loans: any): any {
    const loanMap = new Map(loans.map((l) => [l.monthend, l.balance]));

    return deposits
      .filter((d) => loanMap.has(d.monthend))
      .map((d) => {
        const cdcballak = parseFloat(d.balance);
        const balance = loanMap.get(d.monthend)!;
        return {
          monthend: d.monthend,
          cdcballak,
          balance,
          ratio: balance ? Number((cdcballak / Number(balance)).toFixed(2)) : 0,
        };
      });
  }

  private getSummary(data: any[]): {
    sum_balance: number;
    sum_npl_balance: number;
  } {
    return data.reduce(
      (acc, item) => {
        acc.sum_balance += parseFloat(item.balance);
        acc.sum_npl_balance += parseFloat(item.npl_balance);
        return acc;
      },
      { sum_balance: 0, sum_npl_balance: 0 },
    );
  }

  private sumNpl(data: any[]) {
    const grouped: Record<
      string,
      {
        code: number;
        name: string;
        monthend: string;
        loan_plan: string;
        balance: number;
        npl_plan: string;
        npl_balance: number;
        app_amount: string;
        classA: string;
        classB: string;
        classC: string;
        classD: string;
        classE: string;
        short: string;
        middle: string;
        longs: string;
      }
    > = {};

    data.forEach((e) => {
      const monthend = e.monthend;
      const balance = e.balance;
      const npl_balance = e.npl_balance;
      const code = e.code;

      if (!grouped[monthend]) {
        grouped[monthend] = {
          code: code,
          name: e.name,
          monthend: monthend,
          loan_plan: e.loan_plan,
          balance: 0,
          npl_plan: e.npl_plan,
          npl_balance: 0,
          app_amount: e.app_amount,
          classA: e.classA,
          classB: e.classB,
          classC: e.classC,
          classD: e.classD,
          classE: e.classE,
          short: e.short,
          middle: e.middle,
          longs: e.longs,
        };
      }

      grouped[monthend].balance += Number(balance);
      grouped[monthend].npl_balance += Number(npl_balance);
    });
    return Object.values(grouped);
  }
}
