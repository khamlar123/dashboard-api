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
    const params: string[] = [date, branch];

    let result: any = null;
    let groupData: any = null;
    let getCategory031723: any = null; //group 031723
    let groupCate: any = null; //group 031723

    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_admin_group_daily(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDateAndGroup(result, 'd');

      [getCategory031723] = await this.database.query(
        `call proc_admin_group_031723_daily(?, ?)`,
        params,
      );
      groupCate = this.groupByDateOrBranch(
        getCategory031723,
        'd',
        branch === 'all' ? '' : branch,
      );
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_admin_group_monthly(?, ?)`,
        [date, branch],
      );

      groupData = this.groupByDateAndGroup(result, 'm');
      [getCategory031723] = await this.database.query(
        `call proc_admin_group_031723_monthly(?, ?)`,
        params,
      );
      groupCate = this.groupByDateOrBranch(
        getCategory031723,
        'm',
        branch === 'all' ? '' : branch,
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_admin_group_yearly(?, ?)`,
        [date, branch],
      );
      groupData = this.groupByDateAndGroup(result, 'y');

      [getCategory031723] = await this.database.query(
        `call proc_admin_group_031723_yearly(?, ?)`,
        params,
      );
      groupCate = this.groupByDateOrBranch(
        getCategory031723,
        'y',
        branch === 'all' ? '' : branch,
      );
    }

    const dateX: string[] = [];
    const asset: number[] = [];
    const manage: number[] = [];
    const salary: number[] = [];

    groupData.forEach((e) => {
      dateX.push(e.date);

      if (e.admin_group === 'Asset') {
        asset.push(+e.cddbal.toFixed(2));
      }

      if (e.admin_group === 'Manage') {
        const findItem = groupCate.find((f) => f.date === e.date)?.cddbal ?? 0;
        manage.push(+(e.cddbal - findItem).toFixed(2));
      }

      if (e.admin_group === 'Salary') {
        salary.push(+e.cddbal.toFixed(2));
      }
    });

    const unique = Array.from(
      new Map(dateX.map((item) => [item, item])).values(),
    );
    const lastManage = +manage[manage.length - 1].toFixed(2);
    const lastSalary = salary[salary.length - 1];

    return {
      dateX: unique,
      asset: asset,
      manage: manage,
      salary: salary,
      total_salary: lastSalary,
      total_manage: lastManage,
      total_plan: Number((lastSalary + lastManage).toFixed(2)),
    };
  }

  async officeExpense(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    const params: string[] = [date, branch];
    let result: any = null;
    let groupData: any = null;
    let getCategory031723: any = null; //group 031723
    let groupCate: any = null; //group 031723

    if (option === 'd') {
      [result] = await this.database.query(
        `call proc_admin_manage_daily(?, ?, ?)`,
        [date, branch, option],
      );

      groupData = this.groupBySubGroup(result);

      [getCategory031723] = await this.database.query(
        `call proc_admin_group_031723_daily(?, ?)`,
        params,
      );
      groupCate = this.groupByDateOrBranch(
        getCategory031723,
        'd',
        branch === 'all' ? '' : branch,
      );
    }

    if (option === 'm') {
      [result] = await this.database.query(
        `call proc_admin_manage_daily(?, ?, ?)`,
        [date, branch, option],
      );
      groupData = this.groupBySubGroup(result);

      [getCategory031723] = await this.database.query(
        `call proc_admin_group_031723_monthly(?, ?)`,
        params,
      );
      groupCate = this.groupByDateOrBranch(
        getCategory031723,
        'm',
        branch === 'all' ? '' : branch,
      );
    }

    if (option === 'y') {
      [result] = await this.database.query(
        `call proc_admin_manage_daily(?, ?, ?)`,
        [date, branch, option],
      );
      groupData = this.groupBySubGroup(result);

      [getCategory031723] = await this.database.query(
        `call proc_admin_group_031723_yearly(?, ?)`,
        params,
      );
      groupCate = this.groupByDateOrBranch(
        getCategory031723,
        'y',
        branch === 'all' ? '' : branch,
      );
    }

    const name: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      const findCate = groupCate.find((f) => f.date === e.date)?.cddbal ?? 0;
      name.push(e.sub_group_desc);

      if (e.sub_group === 'Manage_009') {
        amount.push(+(e.cddbal - findCate).toFixed(2));
        return;
      }
      amount.push(+e.cddbal.toFixed(2));
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

  async salary(
    date: string,
    branch: string,
    option: 'd' | 'm' | 'y',
  ): Promise<any> {
    checkCurrentDate(date);
    let result: any = null;
    let groupData: any = null;

    [result] = await this.database.query(
      `call proc_admin_salary_daily(?, ?, ?)`,
      [date, branch, option],
    );
    groupData = this.groupBySubGroup(result);

    const name: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      name.push(e.sub_group_desc);
      amount.push(+e.cddbal.toFixed(2));
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

  private groupByDateOrBranch(
    data: any[],
    option: 'd' | 'm' | 'y',
    branch?: string,
  ) {
    const grouped = data.reduce(
      (acc, item) => {
        const myDataStr = option === 'd' ? item.date : item.monthend;
        const key = branch ? `${myDataStr}_${item.code}` : myDataStr;
        if (!acc[key]) {
          acc[key] = {
            date: myDataStr,
            branch: item.code,
            cddbal: 0,
          };
        }
        acc[key].cddbal += parseFloat(item.cddbal);
        return acc;
      },
      {} as Record<string, { date: string; branch: string; cddbal: number }>,
    );
    return Object.values(grouped);
  }

  private groupBySubGroup(data: any[]) {
    // const grouped: Record<
    //   string,
    //   {
    //     code: number;
    //     name: string;
    //     date: string;
    //     sub_group: string;
    //     sub_group_desc: string;
    //     cddbal: number;
    //   }
    // > = {};
    //
    // data.forEach((e) => {
    //   const sub_group = e.sub_group;
    //   const cddbal = +e.cddbal;
    //   const dateStr = e.date;
    //   if (!grouped[sub_group]) {
    //     grouped[sub_group] = {
    //       code: e.code,
    //       name: e.name,
    //       date: dateStr,
    //       sub_group: e.sub_group,
    //       sub_group_desc: e.sub_group_desc,
    //       cddbal: 0,
    //     };
    //   }
    //   grouped[sub_group].cddbal += cddbal;
    // });
    //
    // return Object.values(grouped);
    const group = data.reduce(
      (acc, item) => {
        const key = item.sub_group;
        if (!acc[key]) {
          acc[key] = {
            code: item.code,
            name: item.name,
            date: item.date,
            sub_group: item.sub_group,
            sub_group_desc: item.sub_group_desc,
            cddbal: 0,
          };
        }
        acc[key].cddbal += parseFloat(item.cddbal);
        return acc;
      },
      {} as Record<
        string,
        {
          code: string;
          name: string;
          date: string;
          sub_group: string;
          sub_group_desc: string;
          cddbal: number;
        }
      >,
    );
    return Object.values(group);
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
