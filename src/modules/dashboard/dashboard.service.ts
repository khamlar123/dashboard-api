import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { AssetsInterface } from '../../common/interfaces/assets.interface';
import { LiabilityInterface } from '../../common/interfaces/liability.interface';
import { CapitalInterface } from '../../common/interfaces/capital.interface';
import { ProfitInterface } from '../../common/interfaces/profit.interface';
import { DashboardIncomeInterface } from '../../common/interfaces/dashbaord-income.interface';
import { DashboardExpense } from '../../common/interfaces/dashboard-expense.interface';
import { FundInterface } from '../../common/interfaces/fund.interface';
import * as moment from 'moment';
import { reduceFunc } from '../../share/functions/reduce-func';
import { sortFunc } from '../../share/functions/sort-func';

@Injectable()
export class DashboardService {
  constructor(private readonly database: DatabaseService) {}

  async allAssets(date: string): Promise<AssetsInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [date]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalAssets: lastItem.Asset,
      comparePlan: +((lastItem.Asset / lastItem.Asset_plan) * 100).toFixed(2),
      values: result.map((m) => Number(m.Asset)),
      dates: result.map((m) => m.date),
    };

    return objectItem;
  }

  async allLiability(date: string): Promise<LiabilityInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [date]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalLiability: lastItem.Liability,
      comparePlan: +(
        (lastItem.Liability / lastItem.Liability_plan) *
        100
      ).toFixed(2),
      values: result.map((m) => Number(m.Liability)),
      dates: result.map((m) => m.date),
    };

    return objectItem;
  }

  async allCapital(date: string): Promise<CapitalInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [date]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalCapital: lastItem.Capital,
      comparePlan: +((lastItem.Capital / lastItem.Capital_plan) * 100).toFixed(
        2,
      ),
      values: result.map((m) => Number(m.Capital)),
      dates: result.map((m) => m.date),
    };

    return objectItem;
  }

  async profit(date: string): Promise<ProfitInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      date,
    ]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalProfit: lastItem.profit,
      comparePlan: +(
        (lastItem.profit / lastItem.amount_profit_plan) *
        100
      ).toFixed(2),
      values: result.map((m) => Number(m.profit)),
      dates: result.map((m) => m.new_date),
    };

    return objectItem;
  }

  async income(date: string): Promise<DashboardIncomeInterface> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      date,
    ]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalIncome: lastItem.income,
      comparePlan: +(
        (lastItem.income / lastItem.amount_income_plan) *
        100
      ).toFixed(2),
      values: result.map((m) => Number(m.income)),
      dates: result.map((m) => m.new_date),
    };

    return objectItem;
  }

  async expense(date: string): Promise<DashboardExpense> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      date,
    ]);

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const lastItem = result[result.length - 1];

    const objectItem = {
      totalExpense: lastItem.expense,
      comparePlan: +(
        (lastItem.expense / lastItem.amount_expense_plan) *
        100
      ).toFixed(2),
      values: result.map((m) => Number(m.expense)),
      dates: result.map((m) => m.new_date),
    };

    return objectItem;
  }

  async funds(date: string): Promise<FundInterface> {
    checkCurrentDate(date);

    const [[capital], [ccy], [deposits]] = await Promise.all([
      this.database.query(`call proc_main_capital(?)`, [date]),
      this.database.query(`call proc_main_capital_ccy(?)`, [date]),
      this.database.query(`call proc_treasury_dep_daily(?, ?)`, [date, 'all']),
    ]);

    if (!capital) {
      throw new NotFoundException('Profit not found');
    }

    const dates: string[] = [];
    const deposit: number[] = [];
    const bol: number[] = [];
    const plan: number[] = [];
    const ccyItem: { capital: number; diff: number; ccy: string }[] = [];
    const depAmount: number[] = [];
    const depCcy: string[] = [];
    const bolAmount: number[] = [];
    const bolCcy: string[] = [];

    ccy.forEach((e) => {
      const itx = {
        capital: Number(e.capital),
        diff: Number(e.cap_diff),
        ccy: e.code,
      };
      ccyItem.push(itx);
      depAmount.push(Number(e.dep_amt));
      depCcy.push(e.code);
      bolAmount.push(Number(e.bol_amt));
      bolCcy.push(e.code);
    });

    const mapItem = capital.map((m) => {
      return {
        dates: m.new_date,
        deposit: Number(m.dep_amt),
        bol: Number(m.bol_amt),
        plan: Number(m.CAP_PLAN),
      };
    });

    mapItem.forEach((e) => {
      dates.push(e.dates);
      deposit.push(e.deposit);
      bol.push(e.bol);
      plan.push(e.plan);
    });

    const convertMont = moment(date).format('YYYYMM').toString();
    const groupData = this.groupByDateAndType(deposits, 'deposit').filter(
      (f) => f.monthend === convertMont,
    );

    const type: string[] = [];
    const currentAcc: number[] = [];
    const fixAcc: number[] = [];
    const savingAcc: number[] = [];
    const dailyAcc: number[] = [];
    const dormantAcc: number[] = [];
    const otherAcc: number[] = [];

    groupData.forEach((e) => {
      type.push(e.dep_type_desc);
      if (e.dep_type_desc === 'CURRENT ACCOUNT') {
        currentAcc.push(Number(e.cdcballak));
      }

      if (e.dep_type_desc === 'FIX ACCOUNT') {
        fixAcc.push(Number(e.cdcballak));
      }

      if (e.dep_type_desc === 'SAVING ACCOUNT') {
        savingAcc.push(Number(e.cdcballak));
      }

      if (e.dep_type_desc === 'DAILY ACCOUNT') {
        dailyAcc.push(Number(e.cdcballak));
      }

      if (e.dep_type_desc === 'DORMANT ACCOUNT') {
        dormantAcc.push(Number(e.cdcballak));
      }

      if (e.dep_type_desc === 'OTHER ACCOUNT') {
        otherAcc.push(Number(e.cdcballak));
      }
    });

    const mergeKeys = ['CURRENT ACCOUNT', 'DORMANT ACCOUNT', 'OTHER ACCOUNT'];
    let merged: any = null;

    const res = groupData.reduce((acc: any, item: any) => {
      if (mergeKeys.includes(item.dep_type_desc)) {
        // Create merged object if first time
        if (!merged) {
          merged = {
            ...item,
            dep_type_desc: 'OTHER ACCOUNT', // final label
            cdcbal: 0,
            cdcballak: 0,
          };
        }

        // Sum cdcbal & cdcballak
        merged.cdcbal += item.cdcbal || 0;
        merged.cdcballak += item.cdcballak || 0;
      } else {
        acc.push(item); // keep normal items
      }

      return acc;
    }, []);

    res.push(merged);

    const depositType: { types: string[]; amounts: number[] } = {
      types: [],
      amounts: [],
    };

    res.forEach((e) => {
      depositType.types.push(e.dep_type_desc);
      depositType.amounts.push(Number(e.cdcballak));
    });

    return {
      chart: {
        dates,
        deposit,
        bol,
        plan,
      },
      ccyItem: ccyItem,
      deposits: { amount: depAmount, ccy: depCcy },
      bols: { amount: bolAmount, ccy: bolCcy },
      depositType: depositType,
    };
  }

  async useFunds(date: string): Promise<any> {
    checkCurrentDate(date);

    const [[useFund], [loanCcy]] = await Promise.all([
      this.database.query(`call proc_main_loan(?)`, [date]),
      this.database.query(`call proc_main_loan_ccy (?)`, [date]),
    ]);

    const dates: string[] = [];
    const values: number[] = [];

    useFund.forEach((e) => {
      dates.push(e.new_date);
      values.push(Number(e.balance));
    });

    const myLoanCcy = loanCcy.map((m) => {
      return {
        ccy: m.code,
        amount: m.Today_amt,
        diff: m.amt_diff,
      };
    });

    return {
      useFunds: {
        dates,
        values,
      },
      loanCcy: myLoanCcy,
    };
  }

  async loanSector(date: string) {
    checkCurrentDate(date);

    const [result] = await this.database.query(
      `call proc_ln_plan_sector_daily(?, ?, ?)`,
      [date, 'ALL', 'M'],
    );

    const groupData = this.groupByCode(result);

    const name: string[] = [];
    const amount: number[] = [];
    const plan: number[] = [];
    const percent: number[] = [];

    groupData.forEach((e) => {
      name.push(e.description);
      amount.push(+e.sector_balance.toFixed(2));
      plan.push(e.sector_plan_amount);
    });

    const total = reduceFunc(amount);

    amount.forEach((e) => {
      percent.push(Number(((e / total) * 100).toFixed(2)));
    });

    return {
      name: name,
      amount: amount,
      // plan: plan,
      percent: percent,
    };
  }

  async plNpl(date: string) {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_main_loan(?)`, [
      date,
    ]);

    const npl: number[] = [];
    const pl: number[] = [];
    let calcPercent: number = 0;

    result.forEach((e) => {
      npl.push(Number(e.npl_balance));
      pl.push(+(Number(e.balance) - Number(e.npl_balance)).toFixed(2));
    });

    calcPercent = +(reduceFunc(npl) + reduceFunc(pl)).toFixed(2);
    const calcNpl = +((reduceFunc(npl) * 100) / calcPercent).toFixed(2);
    const calcPl = +((reduceFunc(pl) * 100) / calcPercent).toFixed(2);

    return {
      npl: reduceFunc(npl),
      pl: reduceFunc(pl),
      nplPercent: calcNpl,
      plPercent: calcPl,
    };
  }

  async financialRatios(date: string) {
    checkCurrentDate(date);

    const [
      [nopAll],
      [nop],
      [capital],
      [profit],
      [deposit],
      [loan],
      [depositCustomer],
      [cash],
    ] = await Promise.all([
      this.database.query(`call proc_main_nop_all(?)`, [date]),
      this.database.query(`call proc_monitor_nop(?, ?)`, [date, '0']),
      this.database.query(`call proc_main_ACL(?)`, [date]),
      this.database.query(`call proc_main_profit(?)`, [date]),
      this.database.query(`call proc_main_capital(?)`, [date]),
      this.database.query(`call proc_main_loan(?)`, [date]),
      this.database.query(`call proc_treasury_dep_monthly(?, ?)`, [
        date,
        'ALL',
      ]),
      this.database.query(`call proc_treasury_cash_monthly(?, ?)`, [
        date,
        'ALL',
      ]),
    ]);

    function sortAndGetLash(array: any[], sortField: string) {
      const sort = sortFunc(array, sortField, 'min');
      return sort[sort.length - 1];
    }

    const lastDateD = depositCustomer[depositCustomer.length - 1].monthend;
    const lastDateC = cash[cash.length - 1].monthend;
    function getLastDateAndSum(
      array: any[],
      _date: string,
      option: 'deposit' | 'cash',
    ) {
      const filterLastDate = array.filter((f) => f.monthend === _date);

      const calcItem = reduceFunc(
        filterLastDate.map((m) =>
          option === 'deposit' ? Number(m.cdcballak) : Number(m.cddballak),
        ),
      );
      return calcItem;
    }

    const resx: { label: string; percent: number }[] = [];
    const allNop = sortAndGetLash(nopAll, 'new_date');
    const nopCcy = nop;
    const capitalLast = sortAndGetLash(capital, 'date');
    const profitLast = sortAndGetLash(profit, 'new_date');
    const depositLast = sortAndGetLash(deposit, 'new_data');
    const loanLast = sortAndGetLash(loan, 'new_data');
    const depositCustomerLast = getLastDateAndSum(
      depositCustomer,
      lastDateD,
      'deposit',
    );
    const cashLast = getLastDateAndSum(cash, lastDateC, 'cash');

    function pushItxToRes(value: number, name: string) {
      const itx = {
        label: name,
        percent: value,
      };

      resx.push(itx);
    }

    pushItxToRes(Number(allNop.nopall), 'NOP (All)');

    nopCcy.forEach((e) => {
      if (
        e.ccy !== 'CNY' &&
        e.ccy !== 'EUR' &&
        e.ccy !== 'LAK' &&
        e.ccy !== 'VND'
      ) {
        pushItxToRes(Number(e.nop), 'NOP ' + `(${e.ccy})`);
      }
    });

    pushItxToRes(
      +(
        (Number(profitLast.profit) / Number(capitalLast.Capital)) *
        100
      ).toFixed(2),
      'ROE',
    );

    pushItxToRes(
      +((Number(profitLast.profit) / Number(capitalLast.Asset)) * 100).toFixed(
        2,
      ),
      'ROA',
    );

    pushItxToRes(
      +((Number(loanLast.balance) / Number(depositLast.dep_amt)) * 100).toFixed(
        2,
      ),
      'LDR',
    );

    pushItxToRes(
      +(
        (Number(depositLast.CAP_AMOUNT) / Number(loanLast.balance)) *
        100
      ).toFixed(2),
      'ແຫຼ່ງທືນ/ນຳໃຊ້ທືນ',
    );

    pushItxToRes(
      Number(((cashLast / depositCustomerLast) * 100).toFixed(2)),
      'ເງີນສົດ/ເງີນຝາກລູກຄ້າ',
    );

    return resx;
  }

  private groupByDateAndType(data: any[], option: 'deposit' | 'customer') {
    const grouped: Record<
      string,
      {
        code: number;
        name: string;
        monthend: string;
        ccy: string;
        dep_type_desc: string;
        dep_desc: string;
        cdcbal: number;
        cdcballak: number;
      }
    > = {};

    data.forEach((e) => {
      const key = `${moment(e.monthend).format('YYYYMM')}_${option === 'deposit' ? e.dep_type_desc : e.dep_desc}`;
      const cdcbal = +e.cdcbal;
      const cdcballak = +e.cdcballak;

      if (!grouped[key]) {
        grouped[key] = {
          code: e.code,
          name: e.name,
          monthend: moment(e.monthend).format('YYYYMM'),
          ccy: e.ccy,
          dep_type_desc: e.dep_type_desc,
          dep_desc: e.dep_desc,
          cdcbal: 0,
          cdcballak: 0,
        };
      }
      grouped[key].cdcbal = Number((grouped[key].cdcbal += cdcbal).toFixed(2));
      grouped[key].cdcballak = Number(
        (grouped[key].cdcballak += cdcballak).toFixed(2),
      );
    });
    return Object.values(grouped);
  }

  private groupByCode(data: any[]) {
    const grouped: Record<
      string,
      {
        code: number;
        name: string;
        date: string;
        sector_plan_amount: number;
        sector_balance: number;
        sector_code: string;
        description: string;
      }
    > = {};

    data.forEach((e) => {
      const sector_code = e.sector_code;
      const sector_plan_amount = +e.sector_plan_amount;
      const sector_balance = +e.sector_balance;
      if (!grouped[sector_code]) {
        grouped[sector_code] = {
          code: e.code,
          name: e.name,
          date: e.date,
          sector_plan_amount: 0,
          sector_balance: 0,
          sector_code: sector_code,
          description: e.description,
        };
      }

      grouped[sector_code].sector_plan_amount += sector_plan_amount;
      grouped[sector_code].sector_balance += sector_balance;
    });

    return Object.values(grouped);
  }
}
