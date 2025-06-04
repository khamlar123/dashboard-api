import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import * as moment from 'moment';
import { loan } from '../cronjob/sqls/loanV1';
import { sectorBal } from '../cronjob/sqls/sector_bal.sql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectorBal } from '../../entity/sector_bal.entity';
import { Branch } from '../../entity/branch.entity';
import { Sector } from '../../entity/sector.entity';

@Injectable()
export class SectorBalService {
  constructor(
    readonly database: DatabaseService,
    @InjectRepository(SectorBal)
    private readonly sectorBalRepository: Repository<SectorBal>,
    @InjectRepository(Branch)
    private readonly branchRes: Repository<Branch>,
    @InjectRepository(Sector)
    private readonly sectorRes: Repository<Sector>,
  ) {}

  async importByDate(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    const [findBranch, findSectors] = await Promise.all([
      this.branchRes.find(),
      this.sectorRes.find(),
    ]);

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const mydate: any[] = [];
    for (const item of dateArray) {
      const getQuery = sectorBal(item);
      const data = await this.database.queryOds(getQuery);
      mydate.push(data);
    }

    const flatData = mydate.reduce((acc, cur) => acc.concat(cur), []);

    const mapData: SectorBal[] = flatData.map((m) => {
      const getB = findBranch.find((f) => f.code === Number(m.branch_code));
      const getS = findSectors.find((f) => f.sector_code === m.sec);
      return {
        sector: { sector_code: getS?.sector_code },
        date: String(m.date),
        sec_balance: Number(m.balance),
        branch: { code: getB?.code },
      };
    });

    const add = await this.sectorBalRepository.save(mapData);

    return add;
  }
}
