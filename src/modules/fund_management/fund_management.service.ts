import { BadRequestException, Injectable } from '@nestjs/common';
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
      amount: amount,
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
      amount: amount,
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
        +((Number(e.dep_amount1) / Number(findByCode)) * 100).toFixed(2),
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

    const groupData = this.groupByType(result, 'deposit');

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
            : e.i_yearend;
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
}
