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
import { reduceFunc } from '../../share/functions/reduce-func';
import { sortFunc } from '../../share/functions/sort-func';

@Injectable()
export class ProfitService {
  constructor(private readonly database: DatabaseService) {}

  async findProfit(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    let result;

    if (option === 'd') {
      result = await this.database.query(`call proc_profit_dailly(?, ?)`, [
        date,
        branch,
      ]);
    }

    if (option === 'm') {
      result = await this.database.query(`call proc_profit_monthly(?, ?)`, [
        date,
        branch,
      ]);
    }

    if (option === 'y') {
      result = await this.database.query(`call proc_profit_yearly(?, ?)`, [
        date,
        branch,
      ]);
    }

    return [result];
  }

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
  ): Promise<IProfitDailyRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_monthly(?, ?)`,
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
        mapData.dates.push(e.monthend);
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
        mapData.dates.push(e.date);
      });
    }

    mapData.totalPlan = mapData.planProfit[mapData.planProfit.length - 1];
    mapData.totalProfit = mapData.profit[mapData.profit.length - 1];

    return mapData;
  }

  async findProfitYearly(
    date: string,
    branch: string,
  ): Promise<IProfitDailyRes> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_profit_yearly(?, ?)`,
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
        mapData.dates.push(e.l_yearend);
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
        mapData.dates.push(e.date);
      });
    }

    mapData.totalProfit = mapData.profit[mapData.profit.length - 1];
    mapData.totalPlan = mapData.planProfit[mapData.planProfit.length - 1];

    return mapData;
  }

  async profitAll(date: string, oprion: 'd' | 'm' | 'y'): Promise<any> {
    checkCurrentDate(date);
    let result;

    if (oprion === 'd') {
      result = await this.database.query(`call proc_profit_dailly(?, ?)`, [
        date,
        'all',
      ]);
    }

    if (oprion === 'm') {
      result = await this.database.query(`call proc_profit_monthly(?, ?)`, [
        date,
        'all',
      ]);
    }

    if (oprion === 'y') {
      result = await this.database.query(`call proc_profit_yearly(?, ?)`, [
        date,
        'all',
      ]);
    }

    return [result];
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

    sortFunc(result.reverse().slice(-18), 'code', 'min').forEach((e) => {
      mapData.profit.push(e.profit);
      mapData.planProfit.push(e.plan_amt);
      mapData.name.push(e.name);
    });

    console.log('result');

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
