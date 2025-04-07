import { Controller } from '@nestjs/common';
//import { CronjobService } from './cronjob.service';
import { DatabaseService } from 'src/database/database.service';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/entity/branch.entity';
import { Repository } from 'typeorm';
import { IncomeCode } from 'src/entity/income_code.entity';
import { Income } from 'src/entity/income.entity';
import { Logger } from '@nestjs/common';
import { ExpenseCode } from 'src/entity/expense_code.entity';
import { Expense } from 'src/entity/expense.entity';

@Controller('cronjob')
export class CronjobController {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(IncomeCode)
    private readonly incomeCodeRepository: Repository<IncomeCode>,
    @InjectRepository(ExpenseCode)
    private readonly expenseCodeRepository: Repository<ExpenseCode>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  //@Cron('* * * * *') 1min
  @Cron('* 6 * * *')
  async storeIncomeData(): Promise<void> {
    const dateDeleteOneDay = moment().add(-1, 'day').format('YYYYMMDD');
    const sql = `
    with par as (select ${dateDeleteOneDay} as vdate from dual),

     types as (select 'IN001' id, 'Interest Income' descip
               from dual
               union all
               select 'IN002' id, 'commission and Fee' descip
               from dual
               union all
               select 'IN003' id, 'Gain From FX' descip
               from dual
               union all
               select 'IN004' id, 'Reverse provision' descip
               from dual
               union all
               select 'IN005' id, 'Gain Loss trading Derivatives' descip
               from dual
               union all
               select 'IN006' id, 'Income ordinary lease' descip
               from dual
               union all
               select 'IN007' id, 'Others' descip
               from dual),

     brn as (select substr(a.branch_code, 1, 4) branch_code, t.id, t.descip
             from (select distinct branch_code
                   from rpt_branch) a
                      left join types as t on 1 = 1),

     ic1 as (select 'IN001'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               and length(itm_no) = '7'
               and (
                 substr(itm_no, 1, 6) in
                 ('510712', '510722', '510331', '510332', '410332', '410342', '510711', '510721')
                     or substr(itm_no, 1, 5) in
                        ('51012', '51013', '51014', '51016', '51051', '51021', '51023', '51024', '51026', '51052',
                         '51029', '51022', '51031', '51034', '51036', '51037 ')
                 )),
     ic2 as (select 'IN002'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               and length(itm_no) = '7'
               and (substr(itm_no, 1, 5) in
                    ('51018', '51028', '51038', '51068', '51078') or
                    substr(itm_no, 1, 6) = '510747' or
                    substr(itm_no, 1, 4) in ('5108')
                 )),
     ic3 as (select 'IN003'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               and length(itm_no) = '7'
               and substr(itm_no, 1, 5) in
                   ('51061', '41061')),
     ic4 as (select 'IN004'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               and length(itm_no) = '7'
               and (substr(itm_no, 1, 5) in
                    ('57011', '57012', '57018', '57028', '57032', '57034') or
                    substr(itm_no, 1, 6) in ('570131') or
                    substr(itm_no, 1, 4) in ('5705')
                 )),
     ic5 as (select 'IN005'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               and length(itm_no) = '7'
               and substr(itm_no, 1, 6) in
                   ('510741', '510742', '510746', '410741', '410742', '410746')),
     ic6 as (select 'IN006'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               and length(itm_no) = '7'
               and (substr(itm_no, 1, 5) in
                    ('51042') or
                    substr(itm_no, 1, 6) in
                    ('510492'))),
     ic7 as (select 'IN007'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               and length(itm_no) = '7'
               and (substr(itm_no, 1, 5) in
                    ('55061', '55062', '57031', '57038') or
                    substr(itm_no, 1, 6) in ('510731') or
                    substr(itm_no, 1, 4) in ('5508', '5704', '5109', '5501', '5502', '5503', '5504', '5507') or
                    substr(itm_no, 1, 3) in ('580') or
                    substr(itm_no, 1, 7) in ('5107380')
                 )),
     all_ic as (select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic1
                group by AC_DATE, id, substr(br, 1, 4)
                union
                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic2
                group by AC_DATE, id, substr(br, 1, 4)
                union
                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic3
                group by AC_DATE, id, substr(br, 1, 4)
                union
                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic4
                group by AC_DATE, id, substr(br, 1, 4)
                union
                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic5
                group by AC_DATE, id, substr(br, 1, 4)
                union
                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic6
                group by AC_DATE, id, substr(br, 1, 4)
                union
                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic7
                group by AC_DATE, id, substr(br, 1, 4))

    select b.branch_code
         , ifnull((select vdate from par), a.ac_date)                           ac_date
         , round(nvl(a.CDCBAL, 0) + nvl(a.CDDBAL, 0), 2)                     as bal
         , round(round(nvl(a.CDCBAL, 0) + nvl(a.CDDBAL, 0), 2) / 1000000, 2) as balM
         , b.id
         , b.descip
    from brn b
             left join all_ic a
                       on b.id = a.id and b.branch_code = a.br
    order by 1, 5
    `;

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

    const queryData = await this.databaseService.queryOds(sql);

    const mapData = queryData.map((m) => {
      const branch = getBranch(m.branch_code.padEnd(6, '0'));
      const incomeCode = getIncomeCode(m.id);
      return {
        branch: { code: branch?.code },
        amount: m.bal,
        scaled_amount: m.balM,
        date: moment(m.ac_date, 'YYYYMMDD').endOf('day').format('YYYY-MM-DD'),
        income_code: { id: incomeCode?.id },
        description: '',
      };
    });
    const addItems = await this.incomeRepository.save(mapData);

    if (addItems) {
      Logger.log(
        'cron job store Income data saved day -1 successfully' +
          moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      );
    } else {
      Logger.error('Failed to save income data');
    }

    //return queryData;
  }

  //@Cron('* * * * *') 1min
  @Cron('* 6 * * *')
  async storeExpenseData(): Promise<void> {
    const dateDeleteOneDay = moment().add(-1, 'day').format('YYYYMMDD');
    const sql = `with par as (select ${dateDeleteOneDay} as vdate from dual),
     types as (select 'EXP001' id, 'Interest' descip
               from dual
               union all
               select 'EXP002' id, 'commission and Fee' descip
               from dual
               union all
               select 'EXP003' id, 'Provision NPL' descip
               from dual
               union all
               select 'EXP004' id, 'Gain Loss trading available' descip
               from dual
               union all
               select 'EXP005' id, 'Others' descip
               from dual
               union all
               select 'EXP006' id, 'Salary and Wages' descip
               from dual
               union all
               select 'EXP007' id, 'Admin expenses' descip
               from dual
               union all
               select 'EXP008' id, 'Depreciation' descip
               from dual
               union all
               select 'EXP009' id, 'Profit tax' descip
               from dual),

     brn as (select substr(a.branch_code, 1, 4) branch_code, t.id, t.descip
             from (select distinct branch_code
                   from rpt_branch) a
                      left join types as t on 1 = 1),

     ic1 as (select 'EX001'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br = '400100'
               and length(itm_no) = '7'
               and (
                 substr(itm_no, 1, 6) in
                 ('410711', '410721', '410712', '410722')
                     or substr(itm_no, 1, 5) in
                        ('41012', '41013', '41014', '41016', '41051', '41021', '41023',
                         '41024', '41026', '41052', '41031', '41022', '41036', '51011', '41011')
                 )),

     ic2 as (select 'EX002'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br = '400100'
               and length(itm_no) = '7'
               and (substr(itm_no, 1, 5) in
                    ('41018', '41028', '41038', '41068', '41078') or
                    substr(itm_no, 1, 6) = '410748' or
                    substr(itm_no, 1, 4) in ('4108')
                 )),

     ic3 as (select 'EX003'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br = '400100'
               and length(itm_no) = '7'
               and (substr(itm_no, 1, 5) in
                    ('47011', '47012', '47018', '47028', '47032', '47034') or
                    substr(itm_no, 1, 6) in ('470131') or
                    substr(itm_no, 1, 4) in ('4705'))),

     ic4 as (select 'Ex004'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br = '400100'
               and length(itm_no) = '7'
               and (substr(itm_no, 1, 5) in
                    ('57021', '47021') or
                    substr(itm_no, 1, 6) in ('510336', '570133', '410336', '470133')
                 )),

     ic5 as (select 'EX005'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br = '400100'
               and length(itm_no) = '7'
               and (substr(itm_no, 1, 6) in
                    ('410331', '410341', '410731') or
                    substr(itm_no, 1, 5) in ('41058', '41078', '45061', '45062', '47031', '47038') or
                    substr(itm_no, 1, 4) in ('4109', '4501', '4502', '4503', '4504', '4508', '4704') or
                    substr(itm_no, 1, 3) in ('480'))),

     ic6 as (select 'EX006'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br like '4017%'
               and length(itm_no) = '7'
               and substr(itm_no, 1, 3) in
                   ('420')),

     ic7 as (select 'EX007'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br = '400100'
               and length(itm_no) = '7'
               and substr(itm_no, 1, 3) in
                   ('430', '440')),

     ic8 as (select 'EX008'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br = '400100'
               and length(itm_no) = '7'
               and substr(itm_no, 1, 3) in
                   ('460', '560')),

     ic9 as (select 'EX009'              id,
                    ac_date,
                    br,
                    itm_no,
                    substr(itm_no, 1, 6) l6,
                    substr(itm_no, 1, 5) l5,
                    substr(itm_no, 1, 4) l4,
                    ccy,
                    cddbal,
                    cdcbal
             from AITHMST
             where AC_DATE = (select vdate from par)
               #and br = '400100'
               and length(itm_no) = '7'
               and substr(itm_no, 1, 3) in
                   ('490')),

     all_ic as (select AC_DATE,
                       id,

                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic1
                group by AC_DATE, id, substr(br, 1, 4)
                union

                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic2
                group by AC_DATE, id, substr(br, 1, 4)
                union

                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic3
                group by AC_DATE, id, substr(br, 1, 4)
                union

                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic4
                group by AC_DATE, id, substr(br, 1, 4)
                union

                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic5
                group by AC_DATE, id, substr(br, 1, 4)
                union

                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic6
                group by AC_DATE, id, substr(br, 1, 4)
                union

                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic7
                group by AC_DATE, id, substr(br, 1, 4)

                union

                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic8
                group by AC_DATE, id, substr(br, 1, 4)

                union

                select AC_DATE,
                       id,
                       substr(br, 1, 4)    as br,
                       nvl(sum(CDDBAL), 0) as CDDBAL,
                       nvl(sum(CDCBAL), 0) as CDCBAL
                from ic9
                group by AC_DATE, id, substr(br, 1, 4))

       select b.branch_code
       , ifnull((select vdate from par), a.ac_date)                                    ac_date
       , round((nvl(a.CDDBAL, 0) - nvl(a.CDCBAL, 0)) * (-1), 2)                     as bal
       , round(round((nvl(a.CDDBAL, 0) - nvl(a.CDCBAL, 0)) * (-1), 2) / 1000000, 2) as balM
       , b.id
       , b.descip
       from brn b
              left join all_ic a
                     on b.id = a.id and b.branch_code = a.br
       order by 2, 1, 5`;

    const queryData = await this.databaseService.queryOds(sql);

    const [branches, expenseCodes] = await Promise.all([
      this.branchRepository.find({}),
      this.expenseCodeRepository.find({}),
    ]);

    function getBranch(code: string) {
      return branches.find((b: any) => String(b.code) === code);
    }

    function getCode(code: string) {
      return expenseCodes.find((i: any) => String(i.code) === String(code));
    }

    const mapData = queryData.map((m: any) => {
      const branch = getBranch(m.branch_code.padEnd(6, '0'));
      const expenseCode = getCode(m.id);
      return {
        branch: { code: branch?.code },
        amount: m.bal,
        scaled_amount: m.balM,
        date: moment(m.ac_date, 'YYYYMMDD').endOf('day').format('YYYY-MM-DD'),
        expense_code: { id: expenseCode?.id },
        description: '',
      };
    });

    const addItems = await this.expenseRepository.save(mapData);
    if (addItems) {
      Logger.log(
        'cron job store expense data saved day - 1 successfully' +
          moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      );
    } else {
      Logger.error('Failed to save expense data');
    }
  }

  // @Cron('* * * * *')
  @Cron('* 6 * * *')
  async calcProfit() {
    const dateDeleteOneDay = moment().add(-1, 'day').format('YYYY-MM-DD');
    const results = await this.databaseService.calcProfit(
      'p_profit',
      dateDeleteOneDay,
    );

    if (results) {
      Logger.log(
        'cron job calculate profit successfully' +
          moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      );
    } else {
      Logger.error('Failed to calculate data');
    }
  }
}
