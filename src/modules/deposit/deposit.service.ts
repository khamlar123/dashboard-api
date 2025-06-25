import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from '../../entity/deposit.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../common/database/database.service';
import { reduceFunc } from '../../share/functions/reduce-func';
import { IUseFunding } from '../../common/interfaces/use-funding';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    private readonly database: DatabaseService,
  ) {}

  async deposit(date: string, option: 'd' | 'm' | 'y', branch?: string) {
    const [result] = await this.database.query(`call proc_deposit(?, ?, ?)`, [
      date,
      option,
      branch === '' || branch === undefined ? null : branch,
    ]);

    const branches: string[] = [];
    const percents: number[] = [];

    result.forEach((e: IUseFunding) => {
      branches.push(e.name);
      percents.push(+e.percent);
    });

    return {
      table: result,
      total: {
        total_dep_plan: +reduceFunc(result.map((m) => +m.dep_plan)),
        total_cdcballak: +reduceFunc(result.map((m) => +m.cdcballak)),
        total_before_cdcballak: +reduceFunc(
          result.map((m) => +m.before_cdcballak),
        ),
        total_diff: +reduceFunc(result.map((m) => +m.diff)),
        total_percent: +(
          (reduceFunc(result.map((m) => +m.cdcballak)) /
            reduceFunc(result.map((m) => +m.dep_plan))) *
          100
        ).toFixed(2),
      },
      chart: {
        branches,
        percents,
      },
    };
  }
}
