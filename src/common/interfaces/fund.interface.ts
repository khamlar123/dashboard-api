export interface FundInterface {
  chart: {
    dates: string[];
    deposit: number[];
    bol: number[];
    plan: number[];
    capAmount: number[];
  };
  ccyItem: { capital: number; diff: number; ccy: string }[];
  deposits: { amount: number[]; ccy: string[]; lakAmount: number[] };
  bols: { amount: number[]; ccy: string[]; lakAmount: number[] };
  depositType: {
    types: string[];
    amounts: number[];
  };
}
