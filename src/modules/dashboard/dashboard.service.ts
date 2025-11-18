import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { AssetsInterface } from '../../common/interfaces/assets.interface';
import { LiabilityInterface } from '../../common/interfaces/liability.interface';
import { CapitalInterface } from '../../common/interfaces/capital.interface';
import { ProfitInterface } from '../../common/interfaces/profit.interface';
import { DashboardIncomeInterface } from '../../common/interfaces/dashbaord-income.interface';
import { DashboardExpense } from '../../common/interfaces/dashboard-expense.interface';
import { FundInterface } from '../../common/interfaces/fund.interface';

@Injectable()
export class DashboardService {
  constructor(private readonly database: DatabaseService) {}

  async allAssets(date: string): Promise<AssetsInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [date]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalAssets: lastItem.Asset,
      comparePlan: +((lastItem.Asset / lastItem.Asset_plan) * 100).toFixed(2),
      values: result.map((m) => Number(m.Asset)),
      dates: result.map((m) => m.date),
    };

    return objectItem;
  }

  async allLiability(date: string): Promise<LiabilityInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [date]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalLiability: lastItem.Liability,
      comparePlan: +(
        (lastItem.Liability / lastItem.Liability_plan) *
        100
      ).toFixed(2),
      values: result.map((m) => Number(m.Liability)),
      dates: result.map((m) => m.date),
    };

    return objectItem;
  }

  async allCapital(date: string): Promise<CapitalInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [date]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalCapital: lastItem.Capital,
      comparePlan: +((lastItem.Capital / lastItem.Capital_plan) * 100).toFixed(
        2,
      ),
      values: result.map((m) => Number(m.Capital)),
      dates: result.map((m) => m.date),
    };

    return objectItem;
  }

  async profit(date: string): Promise<ProfitInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      date,
    ]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalProfit: lastItem.profit,
      comparePlan: +(
        (lastItem.profit / lastItem.amount_profit_plan) *
        100
      ).toFixed(2),
      values: result.map((m) => Number(m.profit)),
      dates: result.map((m) => m.new_date),
    };

    return objectItem;
  }

  async income(date: string): Promise<DashboardIncomeInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      date,
    ]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalIncome: lastItem.income,
      comparePlan: +(
        (lastItem.income / lastItem.amount_income_plan) *
        100
      ).toFixed(2),
      values: result.map((m) => Number(m.income)),
      dates: result.map((m) => m.new_date),
    };

    return objectItem;
  }

  async expense(date: string): Promise<DashboardExpense> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      date,
    ]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalExpense: lastItem.expense,
      comparePlan: +(
        (lastItem.expense / lastItem.amount_expense_plan) *
        100
      ).toFixed(2),
      values: result.map((m) => Number(m.expense)),
      dates: result.map((m) => m.new_date),
    };

    return objectItem;
  }

  async funds(date: string): Promise<FundInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_capital(?)`, [
      date,
    ]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const dates: string[] = [];
    const deposit: number[] = [];
    const bol: number[] = [];
    const plan: number[] = [];

    const mapItem = result.map((m) => {
      return {
        dates: m.new_date,
        deposit: Number(m.dep_amt),
        bol: Number(m.bol_amt),
        plan: Number(m.CAP_PLAN),
      };
    });

    mapItem.forEach((e) => {
      dates.push(e.dates);
      deposit.push(e.deposit);
      bol.push(e.bol);
      plan.push(e.plan);
    });

    return {
      dates,
      deposit,
      bol,
      plan,
    };
  }
}
