import { ILoanBol } from './loan-bol';

export interface ILoanBolRes {
  tables: ILoanBol[];
  total: {
    total_plan: number;
    total_bol1: number;
    total_bol2: number;
    total_diff: number;
    total_percent: number;
  };
  chart: {
    branches: string[];
    percents: number[];
  };
}
