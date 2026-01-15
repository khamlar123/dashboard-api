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
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { checkInputDate } from '../../share/functions/check-input-date';

@Injectable()
export class DashboardService {
  constructor(
    private readonly database: DatabaseService,
    private readonly httpService: HttpService,
  ) {}

  async allAssets(date: string): Promise<AssetsInterface> {
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [
      myDate,
    ]);

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
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [
      myDate,
    ]);

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
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);
    const [result] = await this.database.query(`call proc_main_ACL(?)`, [
      myDate,
    ]);

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
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      myDate,
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
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      myDate,
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
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);
    const [result] = await this.database.query(`call proc_main_profit(?)`, [
      myDate,
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
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);

    const [[capital], [ccy], [deposits], [rate]] = await Promise.all([
      this.database.query(`call proc_main_capital(?)`, [myDate]),
      this.database.query(`call proc_main_capital_ccy(?)`, [myDate]),
      this.database.query(`call proc_market_dep_monthly(?, ?)`, [
        myDate,
        'all',
      ]),
      this.database.query(`call proc_main_exchange_rate(?)`, [myDate]),
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
    const capAmount: number[] = [];
    const convertBolLak: number[] = [];
    const convertDepLak: number[] = [];

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
      if (e.code !== 'LAK') {
        const myRate = rate.find((f) => f.ccy === e.code).rate;
        convertBolLak.push(Number((e.bol_amt * myRate).toFixed(2)));
        convertDepLak.push(Number((e.dep_amt * myRate).toFixed(2)));
      } else {
        convertBolLak.push(Number(e.bol_amt));
        convertDepLak.push(Number(e.dep_amt));
      }
    });

    const mapItem = capital.map((m) => {
      return {
        dates: m.new_date,
        deposit: Number(m.dep_amt),
        bol: Number(m.bol_amt),
        plan: Number(m.CAP_PLAN),
        capAmount: Number(m.CAP_AMOUNT),
      };
    });

    mapItem.forEach((e) => {
      dates.push(e.dates);
      deposit.push(e.deposit);
      bol.push(e.bol);
      plan.push(e.plan);
      capAmount.push(e.capAmount);
    });

    const convertMont = moment(myDate).format('YYYYMM').toString();
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

    const mergeKeys = ['DAILY ACCOUNT', 'DORMANT ACCOUNT', 'OTHER ACCOUNT'];
    let merged: any = null;

    const mergerOther = groupData.reduce((acc: any, item: any) => {
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

    mergerOther.push(merged);

    const depositType: { types: string[]; amounts: number[]; total: number } = {
      types: [],
      amounts: [],
      total: 0,
    };

    mergerOther.forEach((e) => {
      depositType.types.push(
        e.dep_type_desc === 'CURRENT ACCOUNT'
          ? ' ເງິນຝາກກະແສລາຍວັນ'
          : e.dep_type_desc === 'FIX ACCOUNT'
            ? ' ເງິນຝາກປະຈຳ'
            : e.dep_type_desc === 'SAVING ACCOUNT'
              ? ' ເງິນຝາກອັດຕາໄວ'
              : e.dep_type_desc === 'OTHER ACCOUNT'
                ? ' ເງິນຝາກອື່ນໆ'
                : e.dep_type_desc,
      );
      depositType.amounts.push(Number(e.cdcballak));
    });

    depositType.total = reduceFunc(depositType.amounts);
    return {
      chart: {
        dates,
        deposit,
        bol,
        plan,
        capAmount,
      },
      ccyItem: ccyItem,
      deposits: { amount: depAmount, ccy: depCcy, lakAmount: convertDepLak },
      bols: { amount: bolAmount, ccy: bolCcy, lakAmount: convertBolLak },
      depositType: depositType,
    };
  }

  async useFunds(date: string): Promise<any> {
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);

    const [[useFund], [loanCcy]] = await Promise.all([
      this.database.query(`call proc_main_loan(?)`, [myDate]),
      this.database.query(`call proc_main_loan_ccy (?)`, [myDate]),
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
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);

    const [result] = await this.database.query(
      `call proc_ln_plan_sector_daily(?, ?, ?)`,
      [myDate, 'ALL', 'M'],
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
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);
    const [result] = await this.database.query(`call proc_main_loan(?)`, [
      myDate,
    ]);

    const lastData = result[result.length - 1];

    let calcPercent: number = 0;

    calcPercent = +(
      Number(lastData.npl_balance) + Number(lastData.balance)
    ).toFixed(2);
    const calcNpl = +(
      (Number(lastData.npl_balance) * 100) /
      calcPercent
    ).toFixed(2);
    const calcPl = +((Number(lastData.balance) * 100) / calcPercent).toFixed(2);

    return {
      npl: Number(lastData.npl_balance),
      pl: +(Number(lastData.balance) - Number(lastData.npl_balance)).toFixed(2),
      total: Number(lastData.balance),
      nplPercent: calcNpl,
      plPercent: calcPl,
    };
  }

  async financialRatios(date: string) {
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);

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
      this.database.query(`call proc_main_nop_all(?)`, [myDate]),
      this.database.query(`call proc_monitor_nop(?, ?)`, [myDate, '0']),
      this.database.query(`call proc_main_ACL(?)`, [myDate]),
      this.database.query(`call proc_main_profit(?)`, [myDate]),
      this.database.query(`call proc_main_capital(?)`, [myDate]),
      this.database.query(`call proc_main_loan(?)`, [myDate]),
      this.database.query(`call proc_treasury_dep_monthly(?, ?)`, [
        myDate,
        'ALL',
      ]),
      this.database.query(`call proc_treasury_cash_monthly(?, ?)`, [
        myDate,
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
        (Number(loanLast.balance) / Number(depositLast.CAP_AMOUNT)) *
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

  async sumPeriod(date: string, branch: string, option: 'd' | 'm' | 'y') {
    const myDate = checkInputDate(date);
    checkCurrentDate(myDate);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_ln_plan_bal_npl_daily(?, ?)`,
        [myDate, branch],
      );
      // groupData = this.groupByDate(result, 'daily');
      groupData = result;
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_ln_plan_bal_npl_monthly(?, ?)`,
        [myDate, branch],
      );
      // groupData = this.groupByDate(result, 'monthly');
      groupData = sortFunc(result, 'monthend', 'min');
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_ln_plan_bal_npl_yearly(?, ?)`,
        [myDate, branch],
      );
      // groupData = this.groupByDate(result, 'yearly');
      groupData = sortFunc(result, 'monthend', 'min');
    }
    const short: number[] = [];
    const middle: number[] = [];
    const longs: number[] = [];

    if (branch.toLocaleLowerCase() === 'all') {
      groupData.slice(groupData.length - 18, groupData.length).forEach((e) => {
        short.push(Number(e.short));
        middle.push(Number(e.middle));
        longs.push(Number(e.longs));
      });
    } else {
      short.push(Number(groupData[groupData.length - 1].short));
      middle.push(Number(groupData[groupData.length - 1].middle));
      longs.push(Number(groupData[groupData.length - 1].longs));
    }

    const total = Number(
      (reduceFunc(short) + reduceFunc(middle) + reduceFunc(longs)).toFixed(2),
    );

    return {
      short: reduceFunc(short),
      percentShort: +((reduceFunc(short) / total) * 100).toFixed(2),
      middle: reduceFunc(middle),
      percentMid: +((reduceFunc(middle) / total) * 100).toFixed(2),
      longs: reduceFunc(longs),
      percentLong: +((reduceFunc(longs) / total) * 100).toFixed(2),
      total: total,
    };
  }

  async dpProduct(date: string) {
    checkCurrentDate(date);
    try {
      const getYear = moment(date).format('YYYY');

      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.DP_URL}/epd-product/api/product/all-product?date=${date}&year=${getYear}`,
        ),
      );

      const res = response.data.data;
      // res.allProducts.calcAtm =
      //   res.allProducts.atm - res.allProducts.atmLastMonth;
      // res.allProducts.calcMeporm =
      //   res.allProducts.meporm - res.allProducts.mepormLastMonth;
      // res.allProducts.calcMebank =
      //   res.allProducts.mebank - res.allProducts.mebankLastMonth;
      // res.allProducts.calcQr = res.allProducts.qr - res.allProducts.qrLastMonth;
      // res.allProducts.calcSms =
      //   res.allProducts.sms - res.allProducts.smsLastMonth;
      //
      // delete res.allProducts.atmLastMonth;
      // delete res.allProducts.mebankLastMonth;
      // delete res.allProducts.qrLastMonth;
      // delete res.allProducts.smsLastMonth;

      return res;
    } catch (error) {
      throw error;
    }
  }

  async getExchange(_date: string) {
    const myDate = checkInputDate(_date);
    checkCurrentDate(myDate);
    let branch = 'all';
    let option = 'd';

    let result: any = null;
    if (option === 'd') {
      [result] = await this.database.query(`call proc_treasury_ex_daily(?,?)`, [
        myDate,
        branch,
      ]);
    }

    const dates = [
      ...new Set(result.map((m) => (option === 'd' ? m.date : m.monthend))),
    ];
    const exCny: number[] = [];
    const exEur: number[] = [];
    const exLak: number[] = [];
    const exThb: number[] = [];
    const exUsd: number[] = [];
    const exVnd: number[] = [];

    function loopSetData(array: any) {
      dates.forEach((m) => {
        const itx = array.filter((f) => f.date === m);

        if (itx) {
          const findCNY = itx.find((f) => f.ccy === 'CNY');
          exCny.push(Number(findCNY?.exchange_bal) ?? 0);
          const findEUR = itx.find((f) => f.ccy === 'EUR');
          exEur.push(Number(findEUR?.exchange_bal) ?? 0);
          const findLAK = itx.find((f) => f.ccy === 'LAK');
          exLak.push(Number(findLAK?.exchange_bal) ?? 0);
          const findTHB = itx.find((f) => f.ccy === 'THB');
          exThb.push(Number(findTHB?.exchange_bal) ?? 0);
          const findUSD = itx.find((f) => f.ccy === 'USD');
          exUsd.push(Number(findUSD?.exchange_bal) ?? 0);
          const findVND = itx.find((f) => f.ccy === 'VND');
          exVnd.push(Number(findVND?.exchange_bal) ?? 0);
        } else {
          exCny.push(0);
          exEur.push(0);
          exLak.push(0);
          exThb.push(0);
          exUsd.push(0);
          exVnd.push(0);
        }
      });
    }

    function mapMonthendToDate(array: any) {
      const summed = array.reduce((acc, item) => {
        const key = `${option === 'd' ? item.date : item.monthend}_${item.ccy}`;
        const myDate = option === 'd' ? item.date : item.monthend;
        if (!acc[key]) {
          acc[key] = {
            date: myDate,
            branch_id: item.branch_id,
            ccy: item.ccy,
            exchange_bal: 0,
          };
        }
        acc[key].exchange_bal += parseFloat(item.exchange_bal);
        return acc;
      }, {});

      return summed;
    }

    const summed = mapMonthendToDate(result);
    loopSetData(Object.values(summed) as any);

    return {
      dates: dates,
      exCny: exCny,
      diffCny: this.calcDiffAndPercent(exCny).diff,
      percentCny: this.calcDiffAndPercent(exCny).percent,
      exEur: exEur,
      diffEur: this.calcDiffAndPercent(exEur).diff,
      percentEur: this.calcDiffAndPercent(exEur).percent,
      exLak: exLak,
      diffLak: this.calcDiffAndPercent(exLak).diff,
      percentLak: this.calcDiffAndPercent(exLak).percent,
      exThb: exThb,
      diffThb: this.calcDiffAndPercent(exThb).diff,
      percentThb: this.calcDiffAndPercent(exThb).percent,
      exUsd: exUsd,
      diffUsd: this.calcDiffAndPercent(exUsd).diff,
      percentUsd: this.calcDiffAndPercent(exUsd).percent,
      exVnd: exVnd,
      diffVnd: this.calcDiffAndPercent(exVnd).diff,
      percentVnd: this.calcDiffAndPercent(exVnd).percent,
    };
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

  private calcDiffAndPercent(array: number[]): {
    diff: number;
    percent: number;
  } {
    const currentDate = array[array.length - 1];
    const lastDate = array[array.length - 2];
    const calcDiff = Number((currentDate - lastDate).toFixed(2));
    let calcPercent = 0;
    if (lastDate < 0) {
      calcPercent = Number(((calcDiff / lastDate) * 100 * -1).toFixed(2));
    } else {
      calcPercent = Number(((calcDiff / lastDate) * 100).toFixed(2));
    }

    return {
      diff: calcDiff,
      percent: calcPercent,
    };
  }
}
