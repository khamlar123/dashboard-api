import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from '../../entity/deposit.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../common/database/database.service';
import * as moment from 'moment';
import { reduceFunc } from '../../share/functions/reduce-func';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    private readonly database: DatabaseService,
  ) {}

  async deposit(date: string, currency: string) {
    const todayWhereConditions: any = {};
    const yesterdayWhereConditions: any = {};
    const sql = `SELECT *
                 FROM capital
                 WHERE year = ?`;

    const getYear = moment(date, 'YYYYMMDD').year();
    const getYesterday = moment(date, 'YYYYMMDD')
      .add(-1, 'day')
      .format('YYYYMMDD')
      .toString();
    todayWhereConditions.date = date;
    yesterdayWhereConditions.date = getYesterday;

    if (currency) {
      todayWhereConditions.ccy = currency;
      yesterdayWhereConditions.ccy = currency;
    }

    const [findPlan, today, yesterday] = await Promise.all([
      this.database.query(sql, [getYear]),
      this.depositRepository
        .createQueryBuilder('deposit')
        .where(todayWhereConditions)
        .leftJoin('deposit.branch', 'branch')
        .select([
          'deposit.date AS date',
          'deposit.ccy AS ccy',
          'deposit.cddbal AS cddbal',
          'deposit.cddballak AS cddballak',
          'deposit.cdcbal AS cdcbal',
          'deposit.cdcballak AS cdcballak',
          'branch.code AS branch',
          'branch.name AS name',
        ])
        .getRawMany(),
      this.depositRepository
        .createQueryBuilder('deposit')
        .where(yesterdayWhereConditions)
        .leftJoin('deposit.branch', 'branch')
        .select([
          'deposit.date AS date',
          'deposit.ccy AS ccy',
          'deposit.cddbal AS cddbal',
          'deposit.cddballak AS cddballak',
          'deposit.cdcbal AS cdcbal',
          'deposit.cdcballak AS cdcballak',
          'branch.code AS branch',
          'branch.name AS name',
        ])
        .getRawMany(),
    ]);

    function sumLak(myDeposit: any): {
      branch_code: any;
      name: any;
      current: number;
      before: number;
      plan: number;
    }[] {
      const summed: {
        branch_code: any;
        name: any;
        current: number;
        before: number;
        plan: number;
      }[] = Object.values(
        myDeposit.reduce((acc, item) => {
          const code = item.branch;
          if (!acc[code]) {
            acc[code] = {
              branch_code: code,
              name: item.name,
              current: 0,
              before: 0,
              plan:
                Number(findPlan.find((f) => f.branch_id === code).dep_plan) ??
                0,
            };
          }
          acc[code].current += Number(item.cdcballak);
          return acc;
        }, {}),
      );

      return summed;
    }

    const currentData = sumLak(today);
    const beforeData = sumLak(yesterday);

    const result = currentData.map((m) => {
      const match = beforeData.find((f) => f.branch_code === m.branch_code);
      return {
        branch_code: m.branch_code,
        name: m.name,
        plan: m.plan,
        current: m.current,
        before: match?.current ?? 0,
        difference: m.current - (match?.current ?? 0),
        percent: +((m.current / m.plan) * 100).toFixed(2),
      };
    });

    const branches: string[] = [];
    const percents: number[] = [];

    result.forEach((e) => {
      branches.push(e.name);
      percents.push(e.percent);
    });

    const resX = {
      tables: result,
      total: {
        totalPlan: +reduceFunc(result.map((m) => m.plan)).toFixed(2),
        totalBefore: +reduceFunc(result.map((m) => m.before)).toFixed(2),
        totalCurrent: +reduceFunc(result.map((m) => m.current)).toFixed(2),
        totalDifference: +reduceFunc(result.map((m) => m.difference)).toFixed(
          2,
        ),
        totalPercent: +(
          (reduceFunc(result.map((m) => m.current)) /
            reduceFunc(result.map((m) => m.plan))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    };

    return resX;
  }
}
