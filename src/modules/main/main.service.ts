import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { reduceFunc } from '../../share/functions/reduce-func';

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
    const use_fundingList: number[] = [];
    const capPlan: number[] = [];
    const useFundPlan: number[] = [];

    capital.forEach((e) => {
      name.push(e.name);
      capitalList.push(Number(e.capital1));
      capPlan.push(Number(e.plan_amt));
    });

    use_funding.forEach((e) => {
      use_fundingList.push(Number(e.use_funding1));
      useFundPlan.push(Number(e.plan_amt));
    });

    const sumCapCurrent: number = reduceFunc(capitalList);
    const sumCapPlan: number = reduceFunc(capPlan);
    const sumUseFundCurrent: number = reduceFunc(use_fundingList);
    const sumUseFundPlan: number = reduceFunc(useFundPlan);

    return {
      capital,
      use_funding,
    };
  }
}
