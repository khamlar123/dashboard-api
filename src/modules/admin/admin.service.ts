import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import * as moment from 'moment';
import { reduceFunc } from '../../share/functions/reduce-func';

@Injectable()
export class AdminService {
  constructor(private readonly database: DatabaseService) {}

  async adminPlan(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_admin_group_daily(?, ?)`,
        [date, branch],
      );

      groupData = this.groupByDateAndGroup(result, 'd');
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_admin_group_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupByDateAndGroup(result, 'm');
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_admin_group_yearly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupByDateAndGroup(result, 'y');
    }

    const dateX: string[] = [];
    const asset: number[] = [];
    const manage: number[] = [];
    const salary: number[] = [];

    groupData.forEach((e) => {
      dateX.push(e.date);

      if (e.admin_group === 'Asset') {
        asset.push(e.cddbal);
      }

      if (e.admin_group === 'Manage') {
        manage.push(e.cddbal);
      }

      if (e.admin_group === 'Salary') {
        salary.push(e.cddbal);
      }
    });

    const unique = Array.from(
      new Map(dateX.map((item) => [item, item])).values(),
    );

    return {
      dateX: unique,
      asset: asset,
      manage: manage,
      salary: salary,
      total_salary: salary[salary.length - 1],
      total_manage: manage[manage.length - 1],
      total_plan: salary[salary.length - 1] + manage[manage.length - 1],
    };
  }

  async officeExpense(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_admin_manage_daily(?, ?, ?)`,
        [date, branch, option],
      );

      groupData = this.groupBySubGroup(result);
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_admin_manage_daily(?, ?, ?)`,
        [date, branch, option],
      );
      groupData = this.groupBySubGroup(result);
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_admin_manage_daily(?, ?, ?)`,
        [date, branch, option],
      );
      groupData = this.groupBySubGroup(result);
    }

    const name: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      name.push(e.sub_group_desc);
      amount.push(e.cddbal);
    });

    return {
      name: name,
      amount: amount,
      sumAmount: reduceFunc(amount),
    };
  }

  async totalAssets(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);

    let result: any = null;
    let groupData: any = null;

    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_admin_asset_daily(?, ?, ?)`,
        [date, branch, option],
      );

      groupData = this.groupByGL(result);
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_admin_asset_daily(?, ?, ?)`,
        [date, branch, option],
      );

      groupData = this.groupByGL(result);
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_admin_asset_daily(?, ?, ?)`,
        [date, branch, option],
      );

      groupData = this.groupByGL(result);
    }

    const name: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      name.push(e.gl_desc);
      amount.push(e.cddbal);
    });

    return {
      name: name,
      amount: amount,
      sumAmount: reduceFunc(amount),
    };
  }

  private groupByDateAndGroup(data: any[], option: 'd' | 'm' | 'y') {
    const grouped = data.reduce(
      (acc, item) => {
        const dateStr =
          option === 'd'
            ? item.date
            : option === 'm'
              ? moment(item.monthend).format('YYYYMM')
              : moment(item.monthend).format('YYYYMM');
        const key = `${dateStr}_${item.admin_group}`;
        if (!acc[key]) {
          acc[key] = {
            date: dateStr,
            admin_group: item.admin_group,
            cddbal: 0,
          };
        }
        acc[key].cddbal += parseFloat(item.cddbal);
        return acc;
      },
      {} as Record<
        string,
        { date: string; admin_group: string; cddbal: number }
      >,
    );
    const result = Object.values(grouped);
    return result;
  }

  private groupBySubGroup(data: any[]) {
    const grouped: Record<
      string,
      {
        code: number;
        name: string;
        date: string;
        sub_group: string;
        sub_group_desc: string;
        cddbal: number;
      }
    > = {};

    data.forEach((e) => {
      const sub_group = e.sub_group;
      const cddbal = +e.cddbal;
      if (!grouped[sub_group]) {
        grouped[sub_group] = {
          code: e.code,
          name: e.name,
          date: e.data,
          sub_group: e.sub_group,
          sub_group_desc: e.sub_group_desc,
          cddbal: 0,
        };
      }
      grouped[sub_group].cddbal += cddbal;
    });

    return Object.values(grouped);
  }

  private groupByGL(data: any[]) {
    const grouped: Record<
      string,
      {
        code: number;
        name: string;
        date: string;
        gl_desc: string;
        cddbal: number;
      }
    > = {};

    data.forEach((e) => {
      const gl_desc = e.gl_desc;
      const cddbal = +e.cddbal;
      if (!grouped[gl_desc]) {
        grouped[gl_desc] = {
          code: e.code,
          name: e.name,
          date: e.data,
          gl_desc: e.gl_desc,
          cddbal: 0,
        };
      }
      grouped[gl_desc].cddbal += cddbal;
    });

    return Object.values(grouped);
  }
}
