import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import * as moment from 'moment';
import { reduceFunc } from '../../share/functions/reduce-func';

@Injectable()
export class MonitorService {
  constructor(private readonly database: DatabaseService) {}

  async profit(date: string, day: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_monitor_profit(?, ?)`,
      [date, day],
    );

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const dates: string[] = [];
    const profits: number[] = [];

    result.forEach((e) => {
      dates.push(e.date);
      profits.push(e.profit);
    });

    const findCurrentDate = result.find((f) => f.date === date);
    const findLastDate = result.find(
      (f) => f.date === moment(date).add(-1, 'd').format('yyyyMMDD').toString(),
    );

    const diff = findCurrentDate.profit - findLastDate.profit;
    const percent = +((diff / findLastDate.profit) * 100).toFixed(2);
    return {
      date: dates,
      profits: profits,
      percent: percent,
      diff: diff,
    };
  }

  async creditBalance(date: string, day: string): Promise<any> {
    checkCurrentDate(date);

    const [[loan], [fund]] = await Promise.all([
      this.database.query(`call proc_monitor_loan(?, ?)`, [date, day]),
      this.database.query(`call proc_monitor_loan_use_fund(?, ?)`, [date, day]),
    ]);

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    if (!fund) {
      throw new NotFoundException('Use fund not found');
    }

    const dates: string[] = [];
    const balances: number[] = [];
    const npl: number[] = [];
    const nplRatio: number[] = [];

    loan.forEach((e) => {
      dates.push(e.date);
      balances.push(+e.balance);
      npl.push(+e.npl_balance);
      nplRatio.push(Number(((+e.npl_balance / e.balance) * 100).toFixed(2)));
    });

    const findCurrentDate = loan.find((f) => f.date === date);
    const findLastDate = loan.find(
      (f) => f.date === moment(date).add(-1, 'd').format('yyyyMMDD').toString(),
    );

    const diffBalance =
      Number(findCurrentDate.balance) - Number(findLastDate.balance);
    const diffNpl =
      Number(findCurrentDate.npl_balance) - Number(findLastDate.npl_balance);

    const calcBalance: number = +(
      (diffBalance / Number(findLastDate.balance)) *
      100
    ).toFixed(2);
    const calcNpl = (
      (diffNpl / Number(findLastDate.npl_balance)) *
      100
    ).toFixed(2);
    // const totalLoan: number = reduceFunc(loan.map((m) => +m.balance));
    // const totalFund: number = reduceFunc(fund.map((m) => +m.CAP_AMOUNT1));
    const calcCapital: number[] = [];
    loan.forEach((e) => {
      const itx = fund.find((ee) => ee.date === e.date);
      if (itx) {
        calcCapital.push(
          Number(((e.balance / itx.CAP_AMOUNT1) * 100).toFixed(2)),
        );
      }
    });

    return {
      dates: dates,
      balances: balances,
      percentBalance: calcBalance,
      diffBalance: diffBalance,
      npl: npl,
      percentNpl: calcNpl,
      diffNpl: diffNpl,
      nplRatio: nplRatio,
      capital: calcCapital,
    };
  }

  async deposit(date: string, day: string): Promise<any> {
    checkCurrentDate(date);
    const [[deposit], [findCash]] = await Promise.all([
      this.database.query(`call proc_monitor_dep(?, ?)`, [date, day]),
      this.database.query(`call proc_monitor_cash(?, ?)`, [date, day]),
    ]);

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    if (!findCash) {
      throw new NotFoundException('Cash not found');
    }

    const dates: string[] = [];
    const deposits: number[] = [];
    const cashs: number[] = [];

    this.groupByDate(deposit, 'deposit').forEach((e) => {
      dates.push(e.date);
      deposits.push(e.cdcballak);
    });

    const groupDeposits = this.groupByDate(deposit, 'deposit');

    const findDepositCurrentDate = groupDeposits.find((f) => f.date === date);
    const findDepositLastDate = groupDeposits.find(
      (f) => f.date === moment(date).add(-1, 'd').format('yyyyMMDD').toString(),
    );

    const depositDiff =
      (findDepositCurrentDate?.cdcballak ?? 0) -
      (findDepositLastDate?.cdcballak ?? 0);

    const depositPercent = +(
      (depositDiff / (findDepositLastDate?.cdcballak ?? 0)) *
      100
    ).toFixed(2);

    // cash
    const groupCash = this.groupByDate(findCash, 'credit');

    groupCash.forEach((e) => {
      cashs.push(+e.cdcballak);
    });

    const findCashCurrentDate = groupCash.find((f) => f.date === date);
    const findCashLastDate = groupCash.find(
      (f) => f.date === moment(date).add(-1, 'd').format('yyyyMMDD').toString(),
    );

    const cashDiff =
      (findCashCurrentDate?.cdcballak ?? 0) -
      (findCashLastDate?.cdcballak ?? 0);

    const cashPercent = +(
      (cashDiff / (findCashLastDate?.cdcballak ?? 0)) *
      100
    ).toFixed(2);
    //

    const ratio: number[] = [];

    cashs.forEach((e, i) => {
      ratio.push(Number(((e / deposits[i]) * 100).toFixed(2)));
    });

    // const ratio = +(
    //   reduceFunc(cashs.map((m) => m)) / reduceFunc(deposits.map((m) => m))
    // ).toFixed(2);

    return {
      dates: dates,
      deposits: deposits,
      depositPercent: depositPercent,
      depositDiff: Number(depositDiff.toFixed(2)),
      cash: cashs,
      cashPercent: cashPercent,
      cashDiff: Number(cashDiff.toFixed(2)),
      ratio: ratio,
    };
  }

  async exchange(date: string, day: string): Promise<any> {
    checkCurrentDate(date);

    const lastDate = moment(date).add(-1, 'd').format('yyyyMMDD').toString();
    const [[today], [lastDay], [nop], [all]] = await Promise.all([
      this.database.query(`call proc_monitor_exchange(?, ?)`, [date, day]),
      this.database.query(`call proc_monitor_exchange(?, ?)`, [lastDate, day]),
      this.database.query(`call proc_monitor_nop(?, ?)`, [date, day]),
      this.database.query(`call proc_monitor_nop_all(?, ?)`, [date, day]),
    ]);

    if (!today) {
      throw new NotFoundException('Exchange not found');
    }

    if (!lastDay) {
      throw new NotFoundException('Exchange not found');
    }

    const dates = [...new Set(today.map((m) => m.date))];
    const exCny: number[] = [];
    const exEur: number[] = [];
    const exLak: number[] = [];
    const exThb: number[] = [];
    const exUsd: number[] = [];
    const exVnd: number[] = [];

    dates.forEach((m) => {
      // exchange.push(+e.exchange_bal);
      const itx = today.filter((f) => f.date === m);
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

    // const totalToday = reduceFunc(today.map((m) => +m.exchange_bal));
    // const totalLast = reduceFunc(lastDay.map((m) => +m.exchange_bal));
    //
    // const diff = totalToday - totalLast;
    // let percent = 0;
    // if (totalLast && totalLast !== 0) {
    //   percent = Number(((diff / totalLast) * 100).toFixed(2));
    // }
    // if (isNaN(percent)) {
    //   percent = 0;
    // }

    const nopLabel = [...new Set(nop.map((m) => m.date))];
    const nopCny: number[] = [];
    const nopEur: number[] = [];
    const nopLak: number[] = [];
    const nopThb: number[] = [];
    const nopUsd: number[] = [];
    const nopVnd: number[] = [];

    nopLabel.forEach((m) => {
      const itx = nop.filter((f) => f.date === m);
      if (itx) {
        const findCNY = itx.find((f) => f.ccy === 'CNY');
        nopCny.push(findCNY?.nop ?? 0);
        const findEUR = itx.find((f) => f.ccy === 'EUR');
        nopEur.push(findEUR?.nop ?? 0);
        const findLAK = itx.find((f) => f.ccy === 'LAK');
        nopLak.push(findLAK?.nop ?? 0);
        const findTHB = itx.find((f) => f.ccy === 'THB');
        nopThb.push(findTHB?.nop ?? 0);
        const findUSD = itx.find((f) => f.ccy === 'USD');
        nopUsd.push(findUSD?.nop ?? 0);
        const findVND = itx.find((f) => f.ccy === 'VND');
        nopVnd.push(findVND?.nop ?? 0);
      } else {
        nopCny.push(0);
        nopEur.push(0);
        nopLak.push(0);
        nopThb.push(0);
        nopUsd.push(0);
        nopVnd.push(0);
      }
    });

    const nopAll: number[] = [];
    all.forEach((m) => {
      nopAll.push(+m.nopall);
    });

    return {
      dates: dates,
      // exchange: exchange,
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
      // exAll: exAll,
      // exDiff: diff,
      // exPercent: percent,
      // nopLabel: nopLabel,
      nopCny: nopCny,
      nopEur: nopEur,
      nopLak: nopLak,
      nopThb: nopThb,
      nopUsd: nopUsd,
      nopVnd: nopVnd,
      nopAll: nopAll,
    };
  }

  async liquidity(date: string, day: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_monitor_Liquidity(?, ?)`,
      [date, day],
    );

    if (!result) {
      throw new NotFoundException('Profit not found');
    }

    const dates = [...new Set(result.map((m) => m.date))];
    const cny: number[] = [];
    const eur: number[] = [];
    const lak: number[] = [];
    const thb: number[] = [];
    const usd: number[] = [];
    const vnd: number[] = [];
    let all: number[] = [];

    const groupData = this.groupByDateLiq(result);
    all = groupData.map((m) => m.Liquiditylak);

    dates.forEach((m) => {
      const itx = result.filter((f) => f.date === m);
      if (itx) {
        const findCNY = itx.find((f) => f.ccy === 'CNY');
        cny.push(Number(findCNY?.Liquiditybal) ?? 0);
        const findEUR = itx.find((f) => f.ccy === 'EUR');
        eur.push(Number(findEUR?.Liquiditybal) ?? 0);
        const findLAK = itx.find((f) => f.ccy === 'LAK');
        lak.push(Number(findLAK?.Liquiditybal) ?? 0);
        const findTHB = itx.find((f) => f.ccy === 'THB');
        thb.push(Number(findTHB?.Liquiditybal) ?? 0);
        const findUSD = itx.find((f) => f.ccy === 'USD');
        usd.push(Number(findUSD?.Liquiditybal) ?? 0);
        const findVND = itx.find((f) => f.ccy === 'VND');
        vnd.push(Number(findVND?.Liquiditybal) ?? 0);
      } else {
        cny.push(0);
        eur.push(0);
        lak.push(0);
        thb.push(0);
        usd.push(0);
        vnd.push(0);
      }
    });

    const today = all[all.length - 1];
    const lastestData = all[all.length - 2];

    const diff = Number((today - lastestData).toFixed(2));
    const percent = Number(((diff / lastestData) * 100).toFixed(2));

    return {
      dates: dates,
      cny: cny,
      eur: eur,
      lak: lak,
      thb: thb,
      usd: usd,
      vnd: vnd,
      all: all,
      diff: diff,
      percent: percent,
    };
  }

  async alc(date: string, day: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(`call proc_monitor_alc(?, ?)`, [
      date,
      day,
    ]);

    if (!result) {
      throw new NotFoundException('ALC not found');
    }

    const capital = result
      .filter((f) => f.category_code === 'Capital')
      .map((m) => Number(m.bal));
    const Liability = result
      .filter((f) => f.category_code === 'Liability')
      .map((m) => Number(m.bal));
    const uniqueNumbers = [...new Set(result.map((m) => m.date))];

    const capitalCalc = this.calcDiffAndPercent(capital);
    const capitalDiff = capitalCalc.diff;
    const capitalPercent = capitalCalc.percent;

    const liabilityCalc = this.calcDiffAndPercent(Liability);
    const liabilityDiff = liabilityCalc.diff;
    const LiabilityPercent = liabilityCalc.percent;

    const totalCurrent =
      capital[capital.length - 1] + Liability[Liability.length - 1];
    const totalLast =
      capital[capital.length - 2] + Liability[Liability.length - 2];

    const calcAssetsDiff = Number((totalCurrent - totalLast).toFixed(2));
    const calcAssertsPercent =
      totalLast !== 0
        ? Number(((calcAssetsDiff / totalLast) * 100).toFixed(2))
        : 0;

    return {
      // dates: uniqueNumbers,
      capital: capital[capital.length - 1],
      capitalDiff: capitalDiff,
      capitalPercent: capitalPercent,

      Liability: Liability[Liability.length - 1],
      liabilityDiff: liabilityDiff,
      liabilityPercent: LiabilityPercent,

      totalAssets: Number((totalCurrent + totalLast).toFixed(2)),
      assetsDiff: calcAssetsDiff,
      assetsPercent: calcAssertsPercent,
      // total: reduceFunc(capital) + reduceFunc(Liability),
    };
  }

  async property(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    let result;
    if (option === 'm') {
      [result] = await this.database.query(`call proc_bd_alc_monthly(?, ?)`, [
        date,
        branch,
      ]);
    } else {
      [result] = await this.database.query(`call proc_bd_alc_yearly(?, ?)`, [
        date,
        branch,
      ]);
    }

    if (!result) {
      throw new NotFoundException('Property not found');
    }

    return {
      dates: result.map((m) => m.new_date),
      value: result.map((m) => Number(m.bal)),
    };
  }

  async bdDeposit(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    let result;
    if (option === 'm') {
      [result] = await this.database.query(`call proc_bd_dep_monthly(?, ?)`, [
        date,
        branch,
      ]);
    } else {
      [result] = await this.database.query(`call proc_bd_dep_yearly(?, ?)`, [
        date,
        branch,
      ]);
    }

    if (!result) {
      throw new NotFoundException('Property not found');
    }

    return {
      dates: result.map((m) => m.new_date),
      value: result.map((m) => Number(m.bal)),
    };
  }

  async useFunding(
    date: string,
    branch: string,
    option: 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    let result;
    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_bd_use_funding_monthly(?, ?)`,
        [date, branch],
      );
    } else {
      [result] = await this.database.query(
        `call proc_bd_use_funding_yearly(?, ?)`,
        [date, branch],
      );
    }

    if (!result) {
      throw new NotFoundException('Property not found');
    }

    return {
      dates: result.map((m) => m.new_date),
      value: result.map((m) => Number(m.bal)),
    };
  }

  async capital(date: string, branch: string, option: 'm' | 'y'): Promise<any> {
    checkCurrentDate(date);
    let result;
    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_bd_capital_monthly(?, ?)`,
        [date, branch],
      );
    } else {
      [result] = await this.database.query(
        `call proc_bd_capital_yearly(?, ?)`,
        [date, branch],
      );
    }

    if (!result) {
      throw new NotFoundException('Property not found');
    }

    return {
      dates: result.map((m) => m.new_date),
      value: result.map((m) => Number(m.cap_amount)),
    };
  }

  private groupByDate(data: any[], option: 'deposit' | 'credit') {
    const grouped: Record<
      string,
      {
        date: string;
        ccy: string;
        cdcbal: number;
        cdcballak: number;
      }
    > = {};

    data.forEach((e) => {
      const date = e.date;
      const cdcbal = option === 'deposit' ? +e.cdcbal : +e.cddbal;
      const cdcballak = option === 'deposit' ? +e.cdcballak : +e.cddballak;

      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          ccy: 'all',
          cdcbal: 0,
          cdcballak: 0,
        };
      }
      grouped[date].cdcbal += cdcbal;
      grouped[date].cdcballak += cdcballak;
    });
    return Object.values(grouped);
  }

  private groupByDateLiq(data: any[]) {
    const grouped: Record<
      string,
      {
        date: string;
        Liquiditylak: number;
      }
    > = {};

    data.forEach((e) => {
      const date = e.date;
      const Liquiditylak = +e.Liquiditylak;
      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          Liquiditylak: 0,
        };
      }
      grouped[date].Liquiditylak += Liquiditylak;
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
