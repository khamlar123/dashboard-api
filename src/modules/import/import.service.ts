import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { loan } from '../cronjob/sqls/loanV1';
import { DatabaseService } from '../../common/database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from '../../entity/loan.entity';
import { Repository } from 'typeorm';
import { sectorBal } from '../cronjob/sqls/sector_bal.sql';
import { SectorBal } from '../../entity/sector_bal.entity';
import { Branch } from '../../entity/branch.entity';
import { Sector } from '../../entity/sector.entity';
import { loan_bol } from '../cronjob/sqls/loan_bol.sql';
import { income } from '../cronjob/sqls/income.sql';
import { IncomeCode } from '../../entity/income_code.entity';
import { Income } from '../../entity/income.entity';
import { expense } from '../cronjob/sqls/expense.sql';
import { ExpenseCode } from '../../entity/expense_code.entity';
import { Expense } from '../../entity/expense.entity';
import { deposit } from '../cronjob/sqls/deposit.sql';
import { Deposit } from '../../entity/deposit.entity';
import { admin } from '../cronjob/sqls/admin.sql';
import { liquidity } from '../cronjob/sqls/liquidity.sql';
import { liquidityExchange } from '../cronjob/sqls/liquidity_exchange.sql';
import { liquidityNop } from '../cronjob/sqls/liquidity_nop.sql';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Branch)
    private readonly branchRes: Repository<Branch>,
    @InjectRepository(Sector)
    private readonly sectorRes: Repository<Sector>,
    @InjectRepository(SectorBal)
    private readonly sectorBalRepository: Repository<SectorBal>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(IncomeCode)
    private readonly incomeCodeRepository: Repository<IncomeCode>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(ExpenseCode)
    private readonly expenseCodeRepository: Repository<ExpenseCode>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    private readonly databaseService: DatabaseService,
  ) {}

  async loanImport(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = loan();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    const flatData = myDate.reduce((acc, cur) => acc.concat(cur), []);

    const mapData = flatData.map((m) => {
      return {
        date: m.Dates,
        balance: m.Loan_Balance_Daily ?? 0,
        npl_balance: m.NPL_Balance_Daily ?? 0,
        app_amount: m.Drawndown_Daily ?? 0,
        branch: Number(m.Branch_code),
        a: m.A ?? 0,
        b: m.B ?? 0,
        c: m.C ?? 0,
        d: m.D ?? 0,
        e: m.E ?? 0,
        short: m.Short ?? 0,
        middle: m.Middle ?? 0,
        longs: m.Longs ?? 0,
      };
    });

    return await this.loanRepository.save(mapData);
  }

  async sectorBalImport(start: string, end: string) {
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
      const getQuery = sectorBal();
      const data = await this.databaseService.queryOds(getQuery, [item]);
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

    return await this.sectorBalRepository.save(mapData);
  }

  async loanBolImport(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = loan_bol();
      const data = await this.databaseService.queryOds(getQuery, [item, item]);
      myDate.push(data);
    }

    const mapData = myDate
      .flatMap((m) => m)
      .map((m) => {
        return {
          branch_id: m.branch,
          bol_type: m.bol_code,
          date: m.AC_DT,
          amount: m.amount,
        };
      });

    const placeholders = mapData.map(() => '(?, ?, ?, ?)').join(', ');
    const values = mapData.flatMap((item) => [
      item.branch_id,
      item.bol_type,
      item.date,
      item.amount,
    ]);

    const query = `INSERT INTO bol_loan (branch_id, bol_type, date, amount)
                   VALUES ${placeholders}`;

    return await this.databaseService.query(query, values);
  }

  async incomeImport(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = income();
      const data = await this.databaseService.queryOds(getQuery, [item, item]);
      myDate.push(data);
    }

    const [branches, incomeCodes] = await Promise.all([
      this.branchRepository.find({}),
      this.incomeCodeRepository.find({}),
    ]);

    function getBranch(code: string) {
      return branches.find((b: any) => String(b.code) === code);
    }

    function getIncomeCode(code: string) {
      return incomeCodes.find((i: any) => String(i.code) === String(code));
    }

    const flatMap = myDate
      .flatMap((m) => m)
      .map((m) => {
        const branch = getBranch(m.branch_code.padEnd(6, '0'));
        const incomeCode = getIncomeCode(m.id);
        return {
          branch: branch,
          amount: m.bal,
          scaled_amount: m.balM,
          date: moment(m.ac_date, 'YYYYMMDD').endOf('day').format('YYYYMMDD'),
          income_code: incomeCode,
          description: incomeCode?.description,
        };
      });

    return await this.incomeRepository.save(flatMap);
  }

  async expenseImport(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = expense();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    const [branches, expenseCodes] = await Promise.all([
      this.branchRepository.find({}),
      this.expenseCodeRepository.find({}),
    ]);

    function getBranch(code: string) {
      return branches.find((b: any) => String(b.code) === code);
    }

    function getCode(code: string) {
      return expenseCodes.find((f: any) => String(f.code) === code);
    }

    const flatMap = myDate
      .flatMap((m) => m)
      .map((m) => {
        const branch = getBranch(m.branch_code.padEnd(6, '0'));
        const expenseCode = getCode(m.id);

        return {
          branch: { code: branch?.code },
          amount: m.bal,
          scaled_amount: m.balM,
          date: moment(m.ac_date, 'YYYYMMDD').endOf('day').format('YYYYMMDD'),
          expense_code: { code: expenseCode?.code },
          description: expenseCode?.description,
        };
      });

    return await this.expenseRepository.save(flatMap);
  }

  async depositImport(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = deposit();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    const flatMap = myDate
      .flatMap((m) => m)
      .map((m) => {
        return {
          date: m.AC_DATE,
          branch: { code: m.branch },
          ccy: m.CCY,
          cddbal: m.CDDBAL,
          cddballak: m.CDDBALLAK,
          cdcbal: m.CDCBAL,
          cdcballak: m.CDCBALLAK,
          depositId: { dep_id: m.dep_id },
          depositType: { dep_type_id: m.Dep_type },
        };
      });

    return await this.depositRepository.save(flatMap);
  }

  async adminImport(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = admin();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    const flatMap = myDate
      .flatMap((m) => m)
      .map((m) => {
        return {
          date: m.AC_DATE,
          branch_id: m.br,
          itm: m.ITM_NO,
          ccy: m.ccy,
          cddbal: m.cddbal,
          cddlak: m.cddlak,
          cdcbal: m.CDCBAL,
          cdclak: m.cdclak,
        };
      });

    const placeholders = flatMap
      .map(() => '(?, ?, ?, ?, ?, ?, ?, ?)')
      .join(', ');

    const query = `INSERT INTO admin_bal (date, branch_id, itm, ccy, cddbal, cddlak, cdcbal, cdclak)
                   VALUES ${placeholders}`;
    const values = flatMap.flatMap((item) => [
      item.date,
      item.branch_id,
      item.itm,
      item.ccy,
      item.cddbal,
      item.cddlak,
      item.cdcbal,
      item.cdclak,
    ]);

    return await this.databaseService.query(query, values);
  }

  async liquidity(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = liquidity();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    const flatMap = myDate
      .flatMap((m) => m)
      .map((m) => {
        return {
          date: m.ac_date,
          branch_id: m.br,
          type: m.type,
          typeid: m.typeID,
          ccy: m.ccy,
          cddbal: m.cddbal,
          cddlak: m.cddlak,
          cdcbal: m.cdcbal,
          cdclak: 0,
        };
      });

    const placeholders = flatMap
      .map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .join(', ');

    const query = `INSERT INTO liquidity (date, branch_id, type, typeid, ccy, cddbal, cddlak, cdcbal, cdclak)
                   VALUES ${placeholders}`;
    const values = flatMap.flatMap((item) => [
      item.date,
      item.branch_id,
      item.type,
      item.typeid,
      item.ccy,
      item.cddbal,
      item.cddlak,
      item.cdcbal,
      item.cdclak,
    ]);

    return await this.databaseService.query(query, values);
  }

  async liquidityExchange(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = liquidityExchange();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    console.log('myDate', myDate);

    const flatMap = myDate
      .flatMap((m) => m)
      .map((m) => {
        return {
          date: m.date,
          branch_id: m.br,
          type: m.category_name,
          ccy: m.ccy,
          bal: m.bal,
        };
      });

    const placeholders = flatMap.map(() => '(?, ?, ?, ?, ?)').join(', ');

    const query = `INSERT INTO liquidity_exchange (date, branch_id, type, ccy, bal)
                   VALUES ${placeholders}`;
    const values = flatMap.flatMap((item) => [
      item.date,
      item.branch_id,
      item.type,
      item.ccy,
      item.bal,
    ]);
    return await this.databaseService.query(query, values);
  }

  async liquidityNop(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = liquidityNop();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    const flatMap = myDate
      .flatMap((m) => m)
      .map((m) => {
        return {
          date: m.date,
          branch_id: m.br,
          type: m.type,
          ccy: m.ccy,
          bal: m.bal,
          ballak: m.ballak,
        };
      });
    
    const placeholders = flatMap.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');

    const query = `INSERT INTO liquidity_nop (date, branch_id, type, ccy, bal, ballak)
                   VALUES ${placeholders}`;
    const values = flatMap.flatMap((item) => [
      item.date,
      item.branch_id,
      item.type,
      item.ccy,
      item.bal,
      item.ballak,
    ]);
    return await this.databaseService.query(query, values);
  }
}
