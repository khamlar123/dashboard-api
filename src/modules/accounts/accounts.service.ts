import { Injectable } from '@nestjs/common';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class AccountsService {
  constructor(private readonly database: DatabaseService) {}

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

    sumItem.forEach((item: any) => {
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
}
