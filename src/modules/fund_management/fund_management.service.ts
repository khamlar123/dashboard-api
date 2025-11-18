import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { reduceFunc } from '../../share/functions/reduce-func';
import * as moment from 'moment';
import { sortFunc } from '../../share/functions/sort-func';

@Injectable()
export class FundManagementService {
  constructor(private readonly database: DatabaseService) {}

  async planDeposit(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_dep_financial(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    const names: string[] = [];
    const plan: number[] = [];
    const amount: number[] = [];

    result.forEach((e) => {
      names.push(e.name);
      plan.push(+e.dep_plan);
      amount.push(+e.dep_amount1);
    });

    return {
      names: names,
      plan: plan,
      totalPlan: Number(reduceFunc(plan).toFixed(2)),
      amount: amount,
      totalAmount: Number(reduceFunc(amount).toFixed(2)),
    };
  }

  async planUseFund(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_use_funding_financial(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    const names: string[] = [];
    const plan: number[] = [];
    const amount: number[] = [];

    result.forEach((e) => {
      names.push(e.name);
      plan.push(+e.use_funding_plan);
      amount.push(+e.loan_balance1);
    });

    return {
      names: names,
      plan: plan,
      totalPlan: Number(reduceFunc(plan).toFixed(2)),
      amount: amount,
      totalAmount: Number(reduceFunc(amount).toFixed(2)),
    };
  }

  async depositUseFund(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    const [[dep], [use_fund]] = await Promise.all([
      this.database.query(`call proc_dep_financial(?, ?, ?)`, [
        date,
        branch,
        option,
      ]),
      this.database.query(`call proc_use_funding_financial(?, ?, ?)`, [
        date,
        branch,
        option,
      ]),
    ]);

    const names: string[] = [];
    const deposit: number[] = [];
    const use_funding: number[] = [];

    dep.forEach((e) => {
      names.push(e.name);
      deposit.push(+e.dep_amount1);
    });

    use_fund.forEach((e) => {
      use_funding.push(+e.loan_balance1);
    });

    return {
      names: names,
      deposit: deposit,
      use_funding: use_funding,
      totalDeposit: reduceFunc(deposit),
      totalUseFund: reduceFunc(use_funding),
    };
  }

  async ldr(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);
    const [[dep], [use_fund]] = await Promise.all([
      this.database.query(`call proc_dep_financial(?, ?, ?)`, [
        date,
        branch,
        option,
      ]),
      this.database.query(`call proc_use_funding_financial(?, ?, ?)`, [
        date,
        branch,
        option,
      ]),
    ]);

    const names: string[] = [];
    const percent: number[] = [];

    dep.forEach((e) => {
      const findByCode = +use_fund.find((f) => f.code === e.code).loan_balance1;
      names.push(e.name);
      percent.push(
        +((Number(findByCode) / Number(e.dep_amount1)) * 100).toFixed(2),
      );
    });

    return {
      name: names,
      percent: percent,
    };
  }

  async depositByType(date: string) {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_market_dep_monthly(?, ?)`,
      [date, 'all'],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }
    const convertMont = moment(date).format('YYYYMM').toString();
    const groupData = this.groupByDateAndType(result, 'deposit').filter(
      (f) => f.monthend === convertMont,
    );
    const names: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      names.push(e.dep_type_desc);
      amount.push(+e.cdcballak);
    });

    // return groupData;
    return {
      names: names,
      amount: amount,
    };
  }

  async bolLoan(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_treasury_bol_loan(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    const groupData = this.groupByBol(result);

    const name: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      name.push(e.bol_desc);
      amount.push(e.amount);
    });

    return {
      name: name,
      amount: amount,
    };
  }

  async liquidity(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_treasury_Liquidity(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }
    const groupData = this.groupByLiquidity(result);

    const type: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      type.push(e.type);
      amount.push(e.cddballak);
    });

    return {
      type: type,
      amount: amount,
    };
  }

  async banner(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    const [[profit], [cash], [deposit], [depositAPB], [treasury]] =
      await Promise.all([
        this.database.query(`call proc_profit_financial(?, ?, ?)`, [
          date,
          branch,
          option,
        ]),

        this.database.query(`call proc_treasury_Liquidity(?, ?, ?)`, [
          date,
          branch,
          option,
        ]),

        this.database.query(`call proc_dep_financial(?, ?, ?)`, [
          date,
          branch,
          option,
        ]),

        this.database.query(`call proc_treasury_banner567(?, ?, ?)`, [
          date,
          branch,
          option,
        ]),
        this.database.query(`call proc_treasury_banner4 (?, ?, ?)`, [
          date,
          branch,
          option,
        ]),
      ]);

    if (!profit) {
      throw new BadRequestException('Data not found');
    }

    const groupByCash = this.groupByCash(cash);
    const findCash = groupByCash.find((f) => f.type === 'ເງິນສົດ');
    const findDeposit = reduceFunc(deposit.map((m) => +m.dep_amount1));
    const calcCash = ((findCash?.cddballak ?? 0) / findDeposit) * 100;

    const groupByApb = this.groupByCash(depositAPB);
    const findBanner5 = groupByApb.find((f) => f.type === 'ເງິນຝາກຢູ່ ທຫລ');
    const findBanner6 = groupByApb.find(
      (f) => f.type === 'ເງິນຝາກທະນາຄານອື່ນ ໃນປະເທດ',
    );
    const findBanner7 = groupByApb.find(
      (f) => f.type === 'ເງິນຝາກທະນາຄານອື່ນ ຕ່າງປະເທດ',
    );

    const findTreasury = reduceFunc(treasury.map((m) => +m.cddballak));
    const calcDeposit = (findTreasury / findDeposit) * 100;

    return {
      banner1: reduceFunc(profit.map((m) => +m.profit1)),
      banner2: 0,
      banner3: Number(calcCash.toFixed(2)),
      banner4: Number(calcDeposit.toFixed(2)),
      banner5: findBanner5?.cddballak,
      banner6: findBanner6?.cddballak,
      banner7: findBanner7?.cddballak,
    };
  }

  async allLiquidity(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_treasury_Liquidity_M_daily(?, ?)`,
        [date, branch],
      );

      groupData = this.groupByDate(result, 'daily');
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_treasury_Liquidity_M_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupByDate(result, 'monthly');
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_treasury_Liquidity_M_yearly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupByDate(result, 'yearly');
    }

    const dates: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      dates.push(e.date);
      amount.push(e.cddballak);
    });

    return {
      dates: dates,
      amount: amount,
    };
  }

  async nop(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    const [exchange] = await this.database.query(
      `call proc_treasury_exchange_daily(?,?,?)`,
      [date, branch, option],
    );

    const [result] = await this.database.query(
      `call proc_treasury_nop_daily(?, ?, ?)`,
      [date, branch, option],
    );

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    if (!exchange) {
      throw new BadRequestException('Data not found');
    }

    const groupEx = this.groupByCcy(exchange);

    const label: string[] = [];
    const percent: number[] = [];
    const amount: number[] = [];

    sortFunc(result, 'ccy', 'min').forEach((e) => {
      label.push(e.ccy);
      percent.push(e.nop);
    });
    sortFunc(groupEx, 'ccy', 'min').forEach((e) => {
      amount.push(e.bal);
    });

    return {
      label: label,
      percent: percent,
      amount: amount,
    };
  }

  private groupByType(data: any[], option: 'deposit' | 'customer') {
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
      const type = option === 'deposit' ? e.dep_type_desc : e.dep_desc;
      const cdcbal = +e.cdcbal;
      const cdcballak = +e.cdcballak;

      if (!grouped[type]) {
        grouped[type] = {
          code: e.code,
          name: e.name,
          monthend: e.monthend,
          ccy: e.ccy,
          dep_type_desc: e.dep_type_desc,
          dep_desc: e.dep_desc,
          cdcbal: 0,
          cdcballak: 0,
        };
      }
      grouped[type].cdcbal += cdcbal;
      grouped[type].cdcballak += cdcballak;
    });
    return Object.values(grouped);
  }

  private groupByLiquidity(data: any[]) {
    const grouped: Record<
      string,
      {
        date: string;
        code: number;
        name: string;
        cddbal: number;
        cddballak: number;
        type: string;
        ccy: string;
      }
    > = {};

    data.forEach((e) => {
      const type = e.type;
      const cddbal = +e.cddbal;
      const cddballak = +e.cddballak;

      if (!grouped[type]) {
        grouped[type] = {
          date: e.data,
          code: e.code,
          name: e.name,
          cddbal: 0,
          cddballak: 0,
          type: type,
          ccy: e.ccy,
        };
      }
      grouped[type].cddbal += cddbal;
      grouped[type].cddballak += cddballak;
    });
    return Object.values(grouped);
  }

  private groupByBol(data: any[]) {
    const grouped: Record<
      string,
      {
        date: string;
        code: number;
        name: string;
        amount: number;
        bol_type: string;
        bol_desc: string;
      }
    > = {};
    data.forEach((e) => {
      const bol_desc = e.bol_desc;
      const amount = +e.amount;

      if (!grouped[bol_desc]) {
        grouped[bol_desc] = {
          date: e.date,
          code: e.code,
          name: e.name,
          amount: 0,
          bol_type: e.bol_type,
          bol_desc: bol_desc,
        };
      }

      grouped[bol_desc].amount += amount;
    });
    return Object.values(grouped);
  }

  private groupByCash(data: any[]) {
    const grouped: Record<
      string,
      {
        date: string;
        code: number;
        name: string;
        cddbal: number;
        cddballak: number;
        type: string;
        ccy: string;
      }
    > = {};

    data.forEach((e) => {
      const type = e.type;
      const cddballak = +e.cddballak;
      const cddbal = +e.cddbal;

      if (!grouped[type]) {
        grouped[type] = {
          date: e.data,
          code: e.code,
          name: e.name,
          cddbal: 0,
          cddballak: 0,
          type: e.type,
          ccy: e.ccy,
        };
      }
      grouped[type].cddbal += cddbal;
      grouped[type].cddballak += cddballak;
    });
    return Object.values(grouped);
  }

  private groupByDate(data: any[], option: 'daily' | 'monthly' | 'yearly') {
    const grouped: Record<
      string,
      {
        date: string;
        code: number;
        name: string;
        cddbal: number;
        cddballak: number;
        type: string;
        ccy: string;
      }
    > = {};

    data.forEach((e) => {
      const date =
        option === 'daily'
          ? e.date
          : option === 'monthly'
            ? e.monthend
            : e.l_yearend;
      const cddbal = +e.cddbal;
      const cddballak = +e.cddballak;

      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          code: e.code,
          name: e.name,
          cddbal: 0,
          cddballak: 0,
          type: e.type,
          ccy: e.ccy,
        };
      }
      grouped[date].cddbal += cddbal;
      grouped[date].cddballak += cddballak;
    });
    return Object.values(grouped);
  }

  private groupByCcy(data: any[]) {
    const grouped: Record<
      string,
      {
        code: number;
        name: string;
        date: string;
        ccy: string;
        bal: number;
      }
    > = {};

    data.forEach((e) => {
      const ccy = e.ccy;
      const bal = +e.bal;
      const code = e.code;
      if (!grouped[ccy]) {
        grouped[ccy] = {
          code: code,
          name: e.name,
          date: e.date,
          ccy: ccy,
          bal: 0,
        };
      }
      grouped[ccy].bal += bal;
    });
    return Object.values(grouped);
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
      grouped[key].cdcbal += cdcbal;
      grouped[key].cdcballak += cdcballak;
    });
    return Object.values(grouped);
  }

  async getAccount(date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(date);

    let result: any = null;
    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_treasury_accounts_daily(?,?)`,
        [date, branch],
      );
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_treasury_accounts_monthly(?,?)`,
        [date, branch],
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_treasury_accounts_yearly(?,?)`,
        [date, branch],
      );
    }

    const sumItem = this.sumByCodeAndDate(result);

    const openDate: string[] = [];
    const openTd: number[] = [];
    const openCasa: number[] = [];

    const closeDate: string[] = [];
    const closeTd: number[] = [];
    const closeCasa: number[] = [];

    sortFunc(sumItem, 'date', 'min').forEach((item: any) => {
      if (item.con === 'OPEN') {
        openDate.push(item.date);
        openTd.push(item.TD);
        openCasa.push(item.CASA);
      } else if (item.con === 'CLOSE') {
        closeDate.push(item.date);
        closeTd.push(item.TD);
        closeCasa.push(item.CASA);
      }
    });

    return {
      open: {
        date: openDate,
        td: openTd,
        ca: openCasa,
      },
      close: {
        date: closeDate,
        td: closeTd,
        ca: closeCasa,
      },
    };
  }

  sumByCodeAndDate(array: any) {
    const result = Object.values(
      array.reduce((acc, item) => {
        const key = `${item.date}_${item.con}`;
        if (!acc[key]) {
          acc[key] = { date: item.date, con: item.con, TD: 0, CASA: 0 };
        }
        acc[key][item.type] += Number(item.count);
        return acc;
      }, {}),
    );

    return result;
  }

  async getExchange(_date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(_date);

    let result: any = null;
    if (option === 'd') {
      [result] = await this.database.query(`call proc_treasury_ex_daily(?,?)`, [
        _date,
        branch,
      ]);
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_treasury_ex_monthly(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_treasury_ex_yearly(?,?)`,
        [_date, branch],
      );
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

  async allNop(_date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(_date);

    let result: any = null;
    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_treasury_nop_all_daily(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_treasury_nop_all_monthly(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_treasury_nop_all_yearly(?,?)`,
        [_date, branch],
      );
    }

    const date: string[] = [];
    const percent: number[] = [];

    result.forEach((item) => {
      date.push(option === 'd' ? item.date : item.monthend);
      percent.push(Number(item.nopall));
    });

    return {
      date,
      percent,
    };
  }

  async ccyNop(_date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(_date);

    let result: any = null;
    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_treasury_nop_ccy_daily(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_treasury_nop_ccy_monthly(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_treasury_nop_ccy_yearly(?,?)`,
        [_date, branch],
      );
    }

    const date = [
      ...new Set(result.map((m) => (option === 'd' ? m.date : m.new_date))),
    ];
    const CNY: number[] = [];
    const EUR: number[] = [];
    const THB: number[] = [];
    const USD: number[] = [];
    const VND: number[] = [];

    if (option === 'd') {
      this.groupByDateCCY(result, option).forEach((e: any) => {
        if (e.ccy === 'CNY') {
          CNY.push(e.nop);
        }

        if (e.ccy === 'EUR') {
          EUR.push(e.nop);
        }

        if (e.ccy === 'THB') {
          THB.push(e.nop);
        }

        if (e.ccy === 'USD') {
          USD.push(e.nop);
        }

        if (e.ccy === 'VND') {
          VND.push(e.nop);
        }
      });
    } else {
      result.forEach((e: any) => {
        if (!e.ccy) {
          CNY.push(0);
          EUR.push(0);
          THB.push(0);
          USD.push(0);
          VND.push(0);
        } else {
          if (e.ccy === 'CNY') {
            CNY.push(Number(e.nop));
          }

          if (e.ccy === 'EUR') {
            EUR.push(Number(e.nop));
          }

          if (e.ccy === 'THB') {
            THB.push(Number(e.nop));
          }

          if (e.ccy === 'USD') {
            USD.push(Number(e.nop));
          }

          if (e.ccy === 'VND') {
            VND.push(Number(e.nop));
          }
        }
      });
    }

    return {
      date: date.map((m) => m),
      CNY,
      EUR,
      THB,
      USD,
      VND,
    };
  }

  private groupByDateCCY(data: any, option: 'd' | 'm' | 'y') {
    const summed = data.reduce((acc, item) => {
      const key = `${item.date}_${item.ccy}`;

      if (!acc[key]) {
        acc[key] = {
          date: item.date,
          ccy: item.ccy,
          asset: 0,
          liability: 0,
          nop: 0,
        };
      }

      acc[key].asset += parseFloat(item.asset);
      acc[key].liability += parseFloat(item.liability);
      acc[key].nop += parseFloat(item.nop);

      return acc;
    }, {});
    return Object.values(summed);
  }

  async ccyType(_date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(_date);

    let result: any = null;
    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_treasury_dep_daily(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_treasury_dep_monthly(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_treasury_dep_yearly(?,?)`,
        [_date, branch],
      );
    }

    const date = [
      ...new Set(result.map((m) => (option === 'd' ? m.date : m.monthend))),
    ];
    const cny: number[] = [];
    const lak: number[] = [];
    const thb: number[] = [];
    const usd: number[] = [];
    const vnd: number[] = [];

    this.groupByDateAndCCy(result, option).forEach((e) => {
      if (!e.ccy) {
        cny.push(0);
        lak.push(0);
        thb.push(0);
        usd.push(0);
        vnd.push(0);
      }

      if (e.ccy === 'CNY') {
        cny.push(Number(e.cdcballak));
      }

      if (e.ccy === 'LAK') {
        lak.push(Number(e.cdcballak));
      }

      if (e.ccy === 'THB') {
        thb.push(Number(e.cdcballak));
      }

      if (e.ccy === 'USD') {
        usd.push(Number(e.cdcballak));
      }

      if (e.ccy === 'VND') {
        vnd.push(Number(e.cdcballak));
      }
    });

    return {
      date,
      cny,
      lak,
      thb,
      usd,
      vnd,
    };
  }

  private groupByDateAndCCy(array: any[], option: 'd' | 'm' | 'y') {
    // Group by date + ccy
    const result = Object.values(
      array.reduce((acc, item) => {
        const key = `${option === 'd' ? item.date : item.monthend}_${item.ccy}`;

        if (!acc[key]) {
          acc[key] = {
            code: item.code,
            name: item.name,
            date: item.date,
            ccy: item.ccy,
            cdcbal: 0,
            cdcballak: 0,
          };
        }

        acc[key].cdcbal += parseFloat(item.cdcbal);
        acc[key].cdcballak += parseFloat(item.cdcballak);

        return acc;
      }, {}),
    ).map((item: any) => ({
      ...item,
      cdcbal: item.cdcbal.toFixed(2),
      cdcballak: item.cdcballak.toFixed(2),
    }));

    return result;
  }

  async depositType(_date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(_date);

    let result: any = null;
    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_treasury_dep_daily(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_treasury_dep_monthly(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_treasury_dep_yearly(?,?)`,
        [_date, branch],
      );
    }

    if (!result) {
      throw new BadRequestException('Data not found');
    }

    const convertMont = moment(_date).format('YYYYMM').toString();
    const groupData = this.groupByDateAndType(result, 'deposit').filter(
      (f) => f.monthend === convertMont,
    );

    const types: string[] = [];
    const currentAcc: number[] = [];
    const fixAcc: number[] = [];
    const savingAcc: number[] = [];
    const dailyAcc: number[] = [];
    const dormantAcc: number[] = [];
    const otherAcc: number[] = [];

    groupData.forEach((e) => {
      types.push(e.dep_type_desc);
      if (e.dep_type_desc === 'CURRENT ACCOUNT') {
        currentAcc.push(e.cdcballak);
      }

      if (e.dep_type_desc === 'FIX ACCOUNT') {
        fixAcc.push(e.cdcballak);
      }

      if (e.dep_type_desc === 'SAVING ACCOUNT') {
        savingAcc.push(e.cdcballak);
      }

      if (e.dep_type_desc === 'DAILY ACCOUNT') {
        dailyAcc.push(e.cdcballak);
      }

      if (e.dep_type_desc === 'DORMANT ACCOUNT') {
        dormantAcc.push(e.cdcballak);
      }

      if (e.dep_type_desc === 'OTHER ACCOUNT') {
        otherAcc.push(e.cdcballak);
      }
    });

    return {
      types: types,
      currentAcc: currentAcc,
      fixAcc: fixAcc,
      savingAcc: savingAcc,
      dailyAcc: dailyAcc,
      dormantAcc: dormantAcc,
      otherAcc: otherAcc,
    };
  }

  async depositCustomerType(
    _date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ) {
    checkCurrentDate(_date);

    let result: any = null;
    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_treasury_dep_daily(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_treasury_dep_monthly(?,?)`,
        [_date, branch],
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_treasury_dep_yearly(?,?)`,
        [_date, branch],
      );
    }

    const convertMont = moment(_date).format('YYYYMM').toString();
    const groupData = this.groupByDateAndType(result, 'customer').filter(
      (f) => f.monthend === convertMont,
    );

    const types: string[] = [];
    const bankDep: number[] = [];
    const personalDep: number[] = [];
    const financialDep: number[] = [];

    groupData.forEach((e) => {
      types.push(e.dep_desc);

      if (e.dep_desc === 'BANK DEPOSIT') {
        bankDep.push(e.cdcballak);
      }

      if (e.dep_desc === 'PERSONAL DEPOSIT') {
        personalDep.push(e.cdcballak);
      }

      if (e.dep_desc === 'FINANCIAL DEPOSIT') {
        financialDep.push(e.cdcballak);
      }
    });

    return {
      types: types,
      bankDep: bankDep,
      personalDep: personalDep,
      financialDep: financialDep,
    };
  }

  async cashAndDeposit(_date: string, branch: string, option: 'd' | 'm' | 'y') {
    checkCurrentDate(_date);

    let deposit: any;
    let findCash: any;

    if (option === 'd') {
      [[deposit], [findCash]] = await Promise.all([
        this.database.query(`call proc_treasury_dep_daily(?, ?)`, [
          _date,
          branch,
        ]),
        this.database.query(`call proc_treasury_cash_daily(?, ?)`, [
          _date,
          branch,
        ]),
      ]);
    }

    if (option === 'm') {
      [[deposit], [findCash]] = await Promise.all([
        this.database.query(`call proc_treasury_dep_monthly(?, ?)`, [
          _date,
          branch,
        ]),
        this.database.query(`call proc_treasury_cash_monthly(?, ?)`, [
          _date,
          branch,
        ]),
      ]);
    }

    if (option === 'y') {
      [[deposit], [findCash]] = await Promise.all([
        this.database.query(`call proc_treasury_dep_yearly(?, ?)`, [
          _date,
          branch,
        ]),
        this.database.query(`call proc_treasury_cash_yearly(?, ?)`, [
          _date,
          branch,
        ]),
      ]);
    }

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    if (!findCash) {
      throw new NotFoundException('Cash not found');
    }

    const dates: string[] = [];
    const deposits: number[] = [];
    const cashs: number[] = [];

    this.groupCashAndDepByDate(deposit, 'deposit', option).forEach((e) => {
      dates.push(e.date);
      deposits.push(e.cdcballak);
    });

    const groupDeposits = this.groupCashAndDepByDate(
      deposit,
      'deposit',
      option,
    );

    const findDepositCurrentDate = groupDeposits.find((f) => f.date === _date);

    let findDepositLastDate: any = null;

    if (option === 'd') {
      findDepositLastDate = groupDeposits.find(
        (f) =>
          f.date === moment(_date).add(-1, 'd').format('YYYYMMDD').toString(),
      );
    } else if (option === 'm') {
      findDepositLastDate = groupDeposits.find(
        (f) =>
          f.date ===
          moment(_date)
            .add(-1, 'M')
            .endOf('month')
            .format('YYYYMMDD')
            .toString(),
      );
    } else {
      findDepositLastDate = groupDeposits.find(
        (f) =>
          f.date ===
          moment(_date)
            .add(-1, 'y')
            .endOf('year')
            .format('YYYYMMDD')
            .toString(),
      );
    }

    const depositDiff =
      (findDepositCurrentDate?.cdcballak ?? 0) -
      (findDepositLastDate?.cdcballak ?? 0);

    const depositPercent = +(
      (depositDiff / (findDepositLastDate?.cdcballak ?? 0)) *
      100
    ).toFixed(2);

    // cash
    const groupCash = this.groupCashAndDepByDate(findCash, 'credit', option);

    groupCash.forEach((e) => {
      cashs.push(+e.cdcballak);
    });

    const findCashCurrentDate = groupCash.find((f) => f.date === _date);

    let findCashLastDate: any;
    if (option === 'd') {
      findCashLastDate = groupCash.find(
        (f) =>
          f.date === moment(_date).add(-1, 'd').format('yyyyMMDD').toString(),
      );
    } else if (option === 'm') {
      findCashLastDate = groupCash.find(
        (f) =>
          f.date ===
          moment(_date)
            .add(-1, 'M')
            .endOf('month')
            .format('yyyyMMDD')
            .toString(),
      );
    } else {
      findCashLastDate = groupCash.find(
        (f) =>
          f.date ===
          moment(_date)
            .add(-1, 'y')
            .endOf('year')
            .format('yyyyMMDD')
            .toString(),
      );
    }

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
      const calc = Number((e / deposits[i]) * 100).toFixed(2);
      ratio.push(Number(calc) ? Number(calc) : 0);
    });

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

  private groupCashAndDepByDate(
    data: any[],
    option: 'deposit' | 'credit',
    mode: 'd' | 'm' | 'y',
  ) {
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
      const date = mode === 'd' ? e.date : e.monthend;
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
}
