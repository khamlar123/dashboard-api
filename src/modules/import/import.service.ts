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
import { reserve } from '../cronjob/sqls/reserve.sql';
import { LiabilityCapitalAsset } from '../cronjob/sqls/liability_capital_asset';
import { adminExp } from '../cronjob/sqls/admin_expense.sql';
import { getDate } from 'date-fns';
import { loadApp } from '../cronjob/sqls/loan_app.sql';
import { exchangeRate } from '../cronjob/sqls/exchange_rate.sql';
import { account } from '../cronjob/sqls/account.sql';
import { loanCcy } from '../cronjob/sqls/loan_ccy.sql';

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
          credit: m.credit,
          ccy: m.ccy,
        };
      });

    const placeholders = mapData.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
    const values = mapData.flatMap((item) => [
      item.branch_id,
      item.bol_type,
      item.date,
      item.amount,
      item.ccy,
      item.credit,
    ]);

    const query = `INSERT INTO bol_loan (branch_id, bol_type, date, amount, ccy, credit)
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
      const subCatQuery = adminExp();
      const dataCate = await this.databaseService.queryOds(subCatQuery, [item]);
      myDate.push(dataCate);
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

  async reserve(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = reserve();
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
          cdclak: m.cdclak,
        };
      });

    const placeholders = flatMap
      .map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .join(', ');

    const query = `INSERT INTO reserve (date, branch_id, type, typeid, ccy, cddbal, cddlak, cdcbal, cdclak)
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

  async liquidityCapAsset(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myData: any[] = [];
    for (const item of dateArray) {
      const getQuery = LiabilityCapitalAsset();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myData.push(data);
    }

    const flatMap = myData
      .flatMap((m) => m)
      .map((m) => {
        return {
          date: m.AC_DATE,
          branch_id: m.br,
          category_code: m.category_code,
          bal: m.bal,
        };
      });

    const placeholders = flatMap.map(() => '(?, ?, ?, ?)').join(', ');

    const query = `INSERT INTO bd_ass_lia_cap (date, branch_id, category_code, bal)
                   VALUES ${placeholders}`;
    const values = flatMap.flatMap((item) => [
      item.date,
      item.branch_id,
      item.category_code,
      item.bal,
    ]);
    return await this.databaseService.query(query, values);
  }

  async loanApp(start: string, end: string) {
    const getQuery = loadApp();
    const data = await this.databaseService.queryOds(getQuery, [start, end]);
    const mapData = data.map((m) => {
      return {
        date: m.AC_DATE,
        branch_id: m.br,
        app_amount: m.amount,
        ccy: m.ccy,
      };
    });

    const placeholders = mapData.map(() => '(?, ?, ?, ?)').join(', ');

    const query = `INSERT INTO loan_app(date, branch_id, app_amount, ccy)
                   VALUES ${placeholders}`;

    const values = mapData.flatMap((item) => [
      item.date,
      item.branch_id,
      item.app_amount,
      item.ccy,
    ]);

    return await this.databaseService.query(query, values);
  }

  async exchangeRate(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = exchangeRate();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    const flatMap = myDate.flatMap((m) => m);
    const placeholders = flatMap.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');

    const query = `INSERT INTO exchange_rate(eff_dt, ccy, exr_typ, buy, sell, mid)
                   VALUES ${placeholders}`;
    const values = flatMap.flatMap((item) => [
      item.eff_dt,
      item.ccy,
      item.exr_typ,
      item.buy,
      item.sell,
      item.mid,
    ]);

    return await this.databaseService.query(query, values);
  }

  async account(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myDate: any[] = [];
    for (const item of dateArray) {
      const getQuery = account();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myDate.push(data);
    }

    // const flatMap = myDate
    //   .flatMap((m) => m)
    //   .map((m) => {
    //     const branch = getBranch(m.branch_code.padEnd(6, '0'));
    //     const expenseCode = getCode(m.id);
    //
    //     return {
    //       branch: { code: branch?.code },
    //       amount: m.bal,
    //       scaled_amount: m.balM,
    //       date: moment(m.ac_date, 'YYYYMMDD').endOf('day').format('YYYYMMDD'),
    //       expense_code: { code: expenseCode?.code },
    //       description: expenseCode?.description,
    //     };
    //   });

    const flatMap = myDate
      .flatMap((m) => m)
      .map((m) => {
        return {
          date: m.OPEN_DATE,
          branch_id: m.branch,
          PROD_CODE: m.PROD_CODE,
          PRDT_NAME: m.PRDT_NAME,
          count: m.count,
          type: m.type,
          con: m.con,
        };
      });

    const placeholders = flatMap.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');

    const query = `INSERT INTO accounts(date, branch_id, PROD_CODE, PRDT_NAME, count, type, con)
                   VALUES ${placeholders}`;

    const values = flatMap.flatMap((item) => [
      item.date,
      item.branch_id,
      item.PROD_CODE,
      item.PRDT_NAME,
      item.count,
      item.type,
      item.con,
    ]);

    return await this.databaseService.query(query, values);
  }

  async loanCcyImport(start: string, end: string) {
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    const dateArray: string[] = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push(startDate.format('YYYYMMDD'));
      startDate.add(1, 'day');
    }

    const myData: any[] = [];
    for (const item of dateArray) {
      const getQuery = loanCcy();
      const data = await this.databaseService.queryOds(getQuery, [item]);
      myData.push(data);
    }

    const flatMap = myData
      .flatMap((m) => m)
      .map((m) => {
        return {
          AC_DATE: m.AC_DATE,
          CCY: m.ccy,
          CDDBAL: m.CDDBAL,
          CDCBAL: m.CDCBAL,
          BALLAK: m.BAL_LAK,
        };
      });

    const placeholders = flatMap.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const query = `INSERT INTO loan_ccy (AC_DATE, CCY, CDDBAL, CDCBAL, BALLAK)
                   VALUES ${placeholders}`;

    const values = flatMap.flatMap((item) => [
      item.AC_DATE,
      item.CCY,
      item.CDDBAL,
      item.CDCBAL,
      item.BALLAK,
    ]);

    return await this.databaseService.query(query, values);
  }

  async getLastItem() {
    const bolLoanQuery = `
  SELECT * FROM bol_loan
  ORDER BY id DESC
  LIMIT 1
`;

    const adminQuery = `
  SELECT * FROM admin_bal
  ORDER BY id DESC
  LIMIT 1
`;

    const liquidityQuery = `
  SELECT * FROM liquidity
  ORDER BY id DESC
  LIMIT 1
`;

    const liquidityExQuery = `
  SELECT * FROM liquidity_exchange
  ORDER BY date DESC
  LIMIT 1
`;

    const liquidityNopQuery = `
  SELECT * FROM liquidity_nop
  ORDER BY date DESC
  LIMIT 1
`;

    const reseveQuery = `
  SELECT * FROM reserve
  ORDER BY id DESC
  LIMIT 1
`;

    const bdAss = ` SELECT * FROM bd_ass_lia_cap ORDER BY date DESC LIMIT 1 `;

    const loadApp = ` SELECT * FROM loan_app ORDER BY date DESC LIMIT 1 `;

    const exchangeRate = `SELECT * FROM exchange_rate Order BY eff_dt DESC LIMIT 1`;

    const account = `SELECT * FROM accounts Order BY date DESC LIMIT 1`;

    const loanCcy = `SELECT * FROM loan_ccy Order BY AC_DATE DESC LIMIT 1`;

    const [
      findLoan,
      findSectorBal,
      [findBolLoan],
      findIncome,
      findExpense,
      findDeposit,
      [findAdmin],
      [findLiquidity],
      [findLiquidityExchange],
      [findLiquidityNop],
      [findReseve],
      [findBdAss],
      [findloadApp],
      [findExchangeRate],
      [findAccount],
      [findLoanCcy],
    ] = await Promise.all([
      this.loanRepository.find({
        take: 1,
        order: {
          id: 'desc',
        },
      }),
      this.sectorBalRepository.find({
        take: 1,
        order: {
          id: 'desc',
        },
      }),
      this.databaseService.query(bolLoanQuery, []),
      this.incomeRepository.find({
        take: 1,
        order: {
          id: 'desc',
        },
      }),
      this.expenseRepository.find({
        take: 1,
        order: {
          id: 'desc',
        },
      }),
      this.depositRepository.find({
        take: 1,
        order: {
          id: 'desc',
        },
      }),
      this.databaseService.query(adminQuery, []),
      this.databaseService.query(liquidityQuery, []),
      this.databaseService.query(liquidityExQuery, []),
      this.databaseService.query(liquidityNopQuery, []),
      this.databaseService.query(reseveQuery, []),
      this.databaseService.query(bdAss, []),
      this.databaseService.query(loadApp, []),
      this.databaseService.query(exchangeRate, []),
      this.databaseService.query(account, []),
      this.databaseService.query(loanCcy, []),
    ]);

    return {
      loan: findLoan[0].date,
      'sector-bal': findSectorBal[0].date,
      'bol-loan': findBolLoan.date,
      income: findIncome[0].date,
      expense: findExpense[0].date,
      deposit: findDeposit[0].date,
      admin: findAdmin.date,
      liquidity: findLiquidity.date,
      'liquidity-exchange': findLiquidityExchange.date,
      'liquidity-nop': findLiquidityNop.date,
      reseve: findReseve.date,
      bd_ass_lia_cap: findBdAss.date,
      'loan-app': findloadApp.date,
      'exchange-rate': findExchangeRate.eff_dt,
      account: findAccount.date,
      'loan-ccy': findLoanCcy.AC_DATE,
    };
  }
}
