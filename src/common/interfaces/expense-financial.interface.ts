export interface expenseFinancialInterface {
  tables: {
    code: number;
    name: string;
    plan_amt: number;
    expense_amt1: number;
    expense_amt2: number;
    diff: number;
    percent: number;
  }[];
  chart: {
    branches: string[];
    percents: number[];
  };
  total: {
    total_plan: number;
    total_expense_amt1: number;
    total_expense_amt2: number;
    total_diff: number;
    total_percent: number;
  };
}
