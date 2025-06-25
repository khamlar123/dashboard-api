import { IUseFunding } from './use-funding';

export interface IUseFundingRes {
  tables: IUseFunding[];
  total: {
    total_use_plan: number;
    total_loan_bal1: number;
    total_loan_bal2: number;
    total_diff: number;
    total_percent: number;
  };
  chart: {
    branches: string[];
    percents: number[];
  };
}
