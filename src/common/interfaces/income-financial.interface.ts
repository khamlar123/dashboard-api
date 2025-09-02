export interface incomeFinancialInterface {
  tables: {
    code: number;
    name: string;
    plan_amt: number;
    income_amt1: number;
    income_amt2: number;
    diff: number;
    percent: number;
  }[];
  chart: {
    branches: string[];
    percents: number[];
  };
  total: {
    total_plan: number;
    total_income_amt1: number;
    total_income_amt2: number;
    total_diff: number;
    total_percent: number;
  };
}
