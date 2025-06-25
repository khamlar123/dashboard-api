import { IProfit } from './profit';

export interface IProfitRes {
  tables: IProfit[];
  total: {
    total_plan: number;
    total_profit1: number;
    total_profit2: number;
    total_diff: number;
    total_percent: number;
  };
  chart: {
    branches: string[];
    percents: number[];
  };
}
