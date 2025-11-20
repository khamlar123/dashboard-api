export interface FundInterface {
  chart: {
    dates: string[];
    deposit: number[];
    bol: number[];
    plan: number[];
  };
  ccyItem: { capital: number; diff: number; ccy: string }[];
  deposits: { amount: number[]; ccy: string[] };
  bols: { amount: number[]; ccy: string[] };
  depositType: {
    types: string[];
    amounts: number[];
  };
}
