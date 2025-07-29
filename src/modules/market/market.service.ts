import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import * as moment from 'moment';

@Injectable()
export class MarketService {
  constructor(private readonly database: DatabaseService) {}

  async depositType(date: string, branch: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_market_dep_monthly(?, ?)`,
      [date, branch],
    );

    const convertMont = moment(date).format('YYYYMM').toString();
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

  async customerType(date: string, branch: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_market_dep_monthly(?, ?)`,
      [date, branch],
    );

    const convertMont = moment(date).format('YYYYMM').toString();
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

  async allCcy(date: string, branch: string): Promise<any> {
    checkCurrentDate(date);
    const [result] = await this.database.query(
      `call proc_market_dep_monthly(?, ?)`,
      [date, branch],
    );

    const groupData = this.groupByDateAndCcy(result);
    const dateX: string[] = [];
    const cny: number[] = [];
    const lak: number[] = [];
    const thb: number[] = [];
    const usd: number[] = [];
    const vnd: number[] = [];

    groupData.forEach((e) => {
      dateX.push(e.monthend);

      if (e.ccy === 'CNY') {
        cny.push(Number(e.cdcbal.toFixed(2)));
      }

      if (e.ccy === 'LAK') {
        lak.push(Number(e.cdcbal.toFixed(2)));
      }

      if (e.ccy === 'THB') {
        thb.push(Number(e.cdcbal.toFixed(2)));
      }

      if (e.ccy === 'USD') {
        usd.push(Number(e.cdcbal.toFixed(2)));
      }

      if (e.ccy === 'VND') {
        vnd.push(Number(e.cdcbal.toFixed(2)));
      }
    });

    const unique = Array.from(
      new Map(dateX.map((item) => [item, item])).values(),
    );

    return {
      dateX: unique,
      cny: cny,
      lak: lak,
      thb: thb,
      usd: usd,
      vnd: vnd,
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
      grouped[key].cdcbal += cdcbal;
      grouped[key].cdcballak += cdcballak;
    });
    return Object.values(grouped);
  }

  private groupByDateAndCcy(data: any[]) {
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
      const key = `${moment(e.monthend).format('YYYYMM')}_${e.ccy}`;
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
}
