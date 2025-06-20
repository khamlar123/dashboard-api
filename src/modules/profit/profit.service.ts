import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { IProfitDailyRes } from '../../common/interfaces/profit-daily-res.interface';
import { IProfitMonthlyRes } from '../../common/interfaces/profit-monthly-res.interface';
import { IProfitYearlyRes } from '../../common/interfaces/profit-yearly-res.interface';
import { IProfitDaily } from '../../common/interfaces/profit-daily.interface';
import { IProfitMonthly } from '../../common/interfaces/profit-monthly.interface';
import { IProfitYearly } from '../../common/interfaces/profit-yearly.interface';
import * as moment from 'moment';
import { checkCurrentDate } from '../../share/functions/check-current-date';

@Injectable()
export class ProfitService {
  constructor(private readonly database: DatabaseService) {}

  async findProfitDaily(
    date: string,
    branch: string,
  ): Promise<IProfitDailyRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_dailly(?, ?)`,
      [date, branch],
    );

    const mapData: IProfitDailyRes = {
      profit: [],
      planProfit: [],
      dates: [],
      totalPlan: 0,
      totalProfit: 0,
    };

    const mapDate = [
      ...new Set(result.map((m) => moment(m.date, 'YYYYMMDD').year())),
    ];

    const yearAmount: { year: number; amount: number }[] = [];

    for (const val of mapDate) {
      yearAmount.push(await this.sumPlanAmount(val as number));
    }

    if (branch !== 'all') {
      result.forEach((e: IProfitDaily) => {
        const year: number = moment(e.date, 'YYYYMMDD').year();
        const planAmount: number =
          yearAmount.find(
            (f: { year: number; amount: number }) => f.year === year,
          )?.amount ?? 0;
        mapData.planProfit.push(Number(planAmount));
        mapData.profit.push(parseFloat(e.profit));
        mapData.dates.push(e.date);
      });
    } else {
      const myArray = this.sumByDate(result, 'daily');
      myArray.forEach((e) => {
        const year: number = moment(e.date, 'YYYYMMDD').year();
        const planAmount: number =
          yearAmount.find((f) => f.year === year)?.amount ?? 0;
        mapData.planProfit.push(Number(planAmount));
        mapData.profit.push(e.total_profit);
        mapData.dates.push(e.date);
      });
    }

    mapData.totalPlan = mapData.planProfit[mapData.planProfit.length - 1];
    mapData.totalProfit = mapData.profit[mapData.profit.length - 1];
    return mapData;
  }

  async findProfitMonthly(
    date: string,
    branch: string,
  ): Promise<IProfitMonthlyRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_monthly(?, ?)`,
      [date, branch],
    );

    const mapData: IProfitMonthlyRes = {
      profit: [],
      planProfit: [],
      monthly: [],
      totalPlan: 0,
      totalProfit: 0,
    };

    const mapDate = [
      ...new Set(result.map((m) => moment(m.monthend, 'YYYYMMDD').year())),
    ];

    const yearAmount: { year: number; amount: number }[] = [];

    for (const val of mapDate) {
      yearAmount.push(await this.sumPlanAmount(val as number));
    }

    if (branch !== 'all') {
      result.forEach((e: IProfitMonthly) => {
        const year: number = moment(e.monthend, 'YYYYMMDD').year();
        const planAmount: number =
          yearAmount.find(
            (f: { year: number; amount: number }) => f.year === year,
          )?.amount ?? 0;
        mapData.planProfit.push(Number(planAmount));
        mapData.profit.push(parseFloat(e.profit));
        mapData.monthly.push(e.monthend);
      });
    } else {
      const myArray = this.sumByDate(result, 'monthly');
      myArray.forEach((e) => {
        const year: number = moment(e.date, 'YYYYMMDD').year();
        const planAmount: number =
          yearAmount.find(
            (f: { year: number; amount: number }) => f.year === year,
          )?.amount ?? 0;
        mapData.planProfit.push(Number(planAmount));
        mapData.profit.push(e.total_profit);
        mapData.monthly.push(e.date);
      });
    }

    mapData.totalPlan = mapData.planProfit[mapData.planProfit.length - 1];
    mapData.totalProfit = mapData.profit[mapData.profit.length - 1];

    return mapData;
  }

  async findProfitYearly(
    date: string,
    branch: string,
  ): Promise<IProfitYearlyRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_yearly(?, ?)`,
      [date, branch],
    );

    const mapData: IProfitYearlyRes = {
      profit: [],
      planProfit: [],
      yearly: [],
      totalPlan: 0,
      totalProfit: 0,
    };

    const mapDate = [
      ...new Set(result.map((m) => moment(m.l_yearend, 'YYYYMMDD').year())),
    ];

    const yearAmount: { year: number; amount: number }[] = [];

    for (const val of mapDate) {
      yearAmount.push(await this.sumPlanAmount(val as number));
    }

    if (branch !== 'all') {
      result.forEach((e: IProfitYearly) => {
        const year: number = moment(e.l_yearend, 'YYYYMMDD').year();
        const planAmount: number =
          yearAmount.find(
            (f: { year: number; amount: number }) => f.year === year,
          )?.amount ?? 0;
        mapData.planProfit.push(Number(planAmount));
        mapData.profit.push(parseFloat(e.profit));
        mapData.yearly.push(e.l_yearend);
      });
    } else {
      const myArray = this.sumByDate(result, 'yearly');
      myArray.forEach((e) => {
        const year: number = moment(e.date, 'YYYYMMDD').year();
        const planAmount: number =
          yearAmount.find(
            (f: { year: number; amount: number }) => f.year === year,
          )?.amount ?? 0;
        mapData.planProfit.push(Number(planAmount));
        mapData.profit.push(e.total_profit);
        mapData.yearly.push(e.date);
      });
    }

    mapData.totalProfit = mapData.profit[mapData.profit.length - 1];
    mapData.totalPlan = mapData.planProfit[mapData.planProfit.length - 1];

    return mapData;
  }

  async profitAllBranchDaily(date: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_dailly(?, ?)`,
      [date, 'all'],
    );

    const mapData: { profit: number[]; planProfit: number[]; name: string[] } =
      {
        profit: [],
        planProfit: [],
        name: [],
      };

    result.slice(-18).forEach((e) => {
      mapData.profit.push(e.profit);
      mapData.planProfit.push(e.plan_amt);
      mapData.name.push(e.name);
    });

    return mapData;
  }

  async profitAllBranchMonthly(date: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_monthly(?, ?)`,
      [date, 'all'],
    );

    const mapData: { profit: number[]; planProfit: number[]; name: string[] } =
      {
        profit: [],
        planProfit: [],
        name: [],
      };

    result.slice(-18).forEach((e) => {
      mapData.profit.push(e.profit);
      mapData.planProfit.push(e.plan_amt);
      mapData.name.push(e.name);
    });

    return mapData;
  }

  async profitAllBranchYearly(date: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_yearly(?, ?)`,
      [date, 'all'],
    );

    const mapData: { profit: number[]; planProfit: number[]; name: string[] } =
      {
        profit: [],
        planProfit: [],
        name: [],
      };

    result.slice(-18).forEach((e) => {
      mapData.profit.push(e.profit);
      mapData.planProfit.push(e.plan_amt);
      mapData.name.push(e.name);
    });

    return mapData;
  }

  private sumByDate(data: any[], option: 'daily' | 'monthly' | 'yearly') {
    const grouped: Record<
      string,
      {
        date: string;
        total_plan_amt: number;
        total_profit: number;
      }
    > = {};

    data.forEach((item) => {
      const date =
        option === 'daily'
          ? item.date
          : option === 'monthly'
            ? item.monthend
            : item.l_yearend;
      const plan = parseFloat(item.plan_amt);
      const profit = parseFloat(item.profit);

      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          total_plan_amt: 0,
          total_profit: 0,
        };
      }

      grouped[date].total_plan_amt += plan;
      grouped[date].total_profit += profit;
    });

    return Object.values(grouped);
  }

  private async sumPlanAmount(
    year: number,
  ): Promise<{ year: number; amount: number }> {
    const [sumePlan] = await this.database.query(
      `SELECT SUM(amount) as amount
       FROM profit_plan
       WHERE \`year\` = ?;`,
      [year],
    );

    return {
      year: year,
      amount: sumePlan.amount ?? 0,
    };
  }
}
