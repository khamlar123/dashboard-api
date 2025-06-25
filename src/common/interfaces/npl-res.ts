import { INpl } from './npl';

export interface INplRes {
  tables: INpl[];
  total: {
    total_plan: number;
    total_balance1: number;
    total_balance2: number;
    total_diff: number;
    total_percent: number;
  };
  chart: {
    branches: string[];
    percents: number[];
  };
}
