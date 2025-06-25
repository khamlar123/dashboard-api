import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class IncomePlanService {
  constructor(private readonly database: DatabaseService) {}

  async findPlanIncome(date: string, branch: string): Promise<any> {
    const [result] = await this.database.query(
      `call proc_profit_dailly(?, ?)`,
      [date, branch],
    );

    const mapData: { profit: number[]; plan_income: number[] } = {
      profit: [],
      plan_income: [],
    };

    if (branch !== 'all') {
      const totalPlan = result
        .map((m) => parseFloat(m.plan_amt))
        .reduce((acc, val) => acc + val, 0);

      result.forEach((e) => {
        mapData.plan_income.push(totalPlan);
        mapData.profit.push(parseFloat(e.profit));
      });
    } else {
      const myarray = this.sumByDate(result);
      const totalPlan = myarray
        .map((m) => m.total_plan_amt)
        .reduce((acc, val) => acc + val, 0);

      myarray.forEach((e) => {
        mapData.plan_income.push(totalPlan);
        mapData.profit.push(e.total_profit);
      });
    }

    return mapData;
  }

  private sumByDate(data: any[]) {
    const grouped: Record<
      string,
      {
        date: string;
        total_plan_amt: number;
        total_profit: number;
      }
    > = {};

    data.forEach((item) => {
      const date = item.date;
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
}
