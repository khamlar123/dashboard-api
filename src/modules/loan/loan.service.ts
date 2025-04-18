import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../../entity/loan.entity';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Branch } from '../../entity/branch.entity';
import { LoanPlan } from '../../entity/loan_plan.entity';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(LoanPlan)
    private readonly loanPlanRepository: Repository<LoanPlan>,
    private readonly db: DatabaseService,
  ) {}

  async findAll() {
    return await this.loanRepository.find({});
  }

  async findOne(id: number) {
    return await this.loanRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async importData(file: Express.Multer.File): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const formattedData = jsonData.map((row: any) => {
      Object.keys(row).forEach((key) => {
        if (
          typeof Number(row?.Dates) === 'number' &&
          Number(row?.Dates) > 40000
        ) {
          // Likely a date, convert it
          row.Dates = moment(row.Dates).format('YYYY-MM-DD');
        }
      });

      return row;
    });

    const [findBranch, findLoanPlan] = await Promise.all([
      this.branchRepository.find(),
      this.loanPlanRepository.find({
        relations: { branch: true },
      }),
    ]);

    function getBranch(code: string) {
      return findBranch.find((b: any) => String(b.code) === code);
    }

    function getLoanPlan(year: string, bcode: string) {
      const findItem = findLoanPlan.find(
        (f) => f.branch?.code === Number(bcode) && f.year === year,
      );
      return findItem;
    }

    const mapData = formattedData.map((m) => {
      const getB = getBranch(m.Branch_code.padEnd(6, '0'));
      const getL = getLoanPlan(
        moment(m.Dates).year().toString(),
        m.Branch_code.padEnd(6, '0'),
      );
      return {
        date: m.Dates,
        balance: m.Loan_Balance_Daily,
        npl_balance: m.NPL_Balance_Daily ?? 0,
        fund: m.Fund,
        drawndown: m.Drawndown_Daily,
        branch: { code: getB?.code },
        a: m.A,
        b: m.B,
        c: m.C,
        d: m.D,
        e: m.E,
        short: m.Short,
        middle: m.Middle,
        longs: m.Longs,
        loan_plan: getL,
      };
    });
    //return mapData;
    return await this.loanRepository.save(mapData);
  }

  async findLoanDaily(branchId?: string, targetDate?: string): Promise<any> {
    const endDate = targetDate
      ? moment(targetDate).endOf('day').toDate()
      : moment().endOf('day').toDate();
    const startDate = moment(endDate)
      .subtract(30, 'days')
      .startOf('day')
      .toDate();

    const query = `
        WITH RECURSIVE date_series AS (SELECT CAST(? AS DATE) AS date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY)
        FROM date_series
        WHERE DATE_ADD(date, INTERVAL 1 DAY) <= CAST(? AS DATE)
            )
        SELECT ds.date,
               COALESCE(l.balance, 0)      AS balance,
               COALESCE(l.npl_balance, 0)  AS npl_balance,
               ${branchId ? '? AS branch_code' : 'COALESCE(b.code, NULL) AS branch_code'},
               COALESCE(lp.amount, NULL)   AS loan_plan_amount,
               COALESCE(lp.npl_plan, NULL) AS loan_plan_npl
        FROM date_series ds
                 LEFT JOIN (SELECT l.*
                            FROM loan l
                                ${branchId ? 'JOIN branch b ON b.code = l.branch_id AND b.code = ?' : ''}) l
                           ON l.date = ds.date
                 LEFT JOIN branch b ON b.code = l.branch_id
                 LEFT JOIN loan_plan lp ON lp.id = l.loan_plan_id
        ORDER BY ds.date ASC
    `;

    const params = [
      moment(startDate).format('YYYY-MM-DD'),
      moment(endDate).format('YYYY-MM-DD'),
    ];

    if (branchId) {
      params.push(branchId); // For branch_code in SELECT
      params.push(branchId); // For branch filter in subquery
    }

    const [results] = await this.db.query(query, params);
    return this.mergeData(results, 'daily');
  }

  async findLoanDataByMonth(
    branchId?: string,
    targetDate?: string,
  ): Promise<any[]> {
    const endDate = targetDate
      ? moment(targetDate).endOf('month').toDate() // End of the target month
      : moment().endOf('month').toDate(); // End of the current month

    const startDate = moment(endDate)
      .subtract(11, 'months')
      .startOf('month')
      .toDate(); // Last 12 months

    const query = `
        WITH RECURSIVE month_series AS (SELECT CAST(? AS DATE) AS month_start
                                        UNION ALL
                                        SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
                                        FROM month_series
                                        WHERE DATE_ADD(month_start, INTERVAL 1 MONTH) <= CAST(? AS DATE))
        SELECT DATE_FORMAT(ms.month_start, '%Y-%m') AS date,
            COALESCE(SUM(l.balance), 0) AS balance,
            COALESCE(SUM(l.npl_balance), 0) AS npl_balance, ${branchId ? '? AS branch_code' : 'COALESCE(b.code, NULL) AS branch_code'}
             , COALESCE (SUM (lp.amount)
             , NULL) AS loan_plan_amount
             , COALESCE (SUM (lp.npl_plan)
             , NULL) AS loan_plan_npl
        FROM month_series ms
            LEFT JOIN (
            SELECT
            DATE_FORMAT(date, '%Y-%m-01') AS month_start, -- Group by month
            l.*
            FROM loan l
            ${branchId ? 'JOIN branch b ON b.code = l.branch_id AND b.code = ?' : ''}
            ) l
        ON DATE_FORMAT(ms.month_start, '%Y-%m-01') = l.month_start
            LEFT JOIN branch b ON b.code = l.branch_id
            LEFT JOIN loan_plan lp ON lp.id = l.loan_plan_id
        GROUP BY ms.month_start, ${branchId ? 'branch_code' : 'b.code'}
        ORDER BY ms.month_start ASC
    `;

    const params = [
      moment(startDate).format('YYYY-MM-01'), // Start of the earliest month
      moment(endDate).format('YYYY-MM-01'), // Start of the latest month
    ];

    if (branchId) {
      params.push(branchId); // For branch_code in SELECT
      params.push(branchId); // For branch filter in subquery
    }

    const [results] = await this.db.query(query, params);
    return this.mergeData(results, 'monthly');
  }

  async findLoanYearly(branchId?: string, targetYear?: string): Promise<any> {
    const endYear = targetYear
      ? moment(targetYear, 'YYYY').endOf('year').toDate()
      : moment().endOf('year').toDate();

    const startYear = moment(endYear)
      .subtract(5, 'years')
      .startOf('year')
      .toDate(); // Last 6 years

    const query = `
        WITH RECURSIVE year_series AS (SELECT CAST(? AS DATE) AS year_start
                                       UNION ALL
                                       SELECT DATE_ADD(year_start, INTERVAL 1 YEAR)
                                       FROM year_series
                                       WHERE DATE_ADD(year_start, INTERVAL 1 YEAR) <= CAST(? AS DATE))
        SELECT
            YEAR (ys.year_start) AS date, COALESCE (SUM (l.balance), 0) AS balance, COALESCE (SUM (l.npl_balance), 0) AS npl_balance, ${branchId ? '? AS branch_code' : 'COALESCE(b.code, NULL) AS branch_code'}, COALESCE (SUM (lp.amount), NULL) AS loan_plan_amount, COALESCE (SUM (lp.npl_plan), NULL) AS loan_plan_npl
        FROM year_series ys
            LEFT JOIN (
            SELECT
            DATE_FORMAT(date, '%Y-01-01') AS year_start, l.*
            FROM loan l
            ${branchId ? 'JOIN branch b ON b.code = l.branch_id AND b.code = ?' : ''}
            ) l
        ON YEAR (ys.year_start) = YEAR (l.year_start)
            LEFT JOIN branch b ON b.code = l.branch_id
            LEFT JOIN loan_plan lp ON lp.id = l.loan_plan_id
        GROUP BY YEAR (ys.year_start), ${branchId ? 'branch_code' : 'b.code'}
        ORDER BY ys.year_start ASC
    `;

    const params = [
      moment(startYear).format('YYYY-MM-DD'), // First day of start year
      moment(endYear).format('YYYY-MM-DD'), // Last day of end year
    ];

    if (branchId) {
      params.push(branchId); // For branch_code in SELECT
      params.push(branchId); // For branch filter in subquery
    }

    const [results] = await this.db.query(query, params);
    return this.mergeData(results, 'yearly');
  }

  async findLoanAll(date?: string): Promise<any> {
    // const whereCondition: any = null;
    // if (date) {
    //   whereCondition.date = moment(date).format('YYYY-MM-DD')
    // }
    //
    // const findItems = await  this.loanRepository.find({
    //   where: whereCondition,
    //   relations: { branch: true, loan_plan: true},
    // });
    //
    // return  findItems;

    // If date is provided, use it directly
    if (date) {
      const formattedDate: any = moment(date).format('YYYY-MM-DD');
      return this.loanRepository.find({
        where: { date: formattedDate },
        relations: ['branch', 'loan_plan'],
        order: { date: 'DESC' },
      });
    }

    // Find the most recent date across all branches
    const lastDate = await this.loanRepository
      .createQueryBuilder('loan')
      .select('MAX(loan.date)', 'maxDate')
      .getRawOne()
      .then((result) => result?.maxDate);

    if (!lastDate) {
      return []; // No loans exist in the database
    }

    // Return all loans for the last available date
    return this.loanRepository.find({
      where: { date: lastDate },
      relations: ['branch', 'loan_plan'],
      order: { branch: { code: 'ASC' } }, // Optional: order by branch code
    });
  }

  private mergeData(array: any[], option: 'daily' | 'monthly' | 'yearly') {
    const hasData: any[] = [];
    array.forEach((m) => {
      const getDate =
        option !== 'yearly'
          ? moment(m.date).endOf('day')
          : moment(m.date, 'yyyy');
      const itx = {
        date:
          option === 'daily'
            ? getDate.format('DD-MM-YYYY')
            : option === 'monthly'
              ? getDate.format('MMM-YYYY')
              : getDate.format('YYYY'),
        balance: Number(m?.balance),
        npl_balance: Number(m?.npl_balance),
        branch_code: m?.branch_code,
        loan_plan_amount: Number(m?.loan_plan_amount),
        loan_plan_npl: Number(m?.loan_plan_npl),
      };
      hasData.push(itx);
    });

    function reduceDataByDate(data) {
      const result = data.reduce((acc, curr) => {
        const existingEntry = acc.find((item) => item.date === curr.date);
        if (existingEntry) {
          existingEntry.balance += curr.balance;
          existingEntry.npl_balance += curr.npl_balance;
          existingEntry.loan_plan_amount += curr.loan_plan_amount;
          existingEntry.loan_plan_npl += curr.loan_plan_npl;
        } else {
          acc.push({ ...curr });
        }
        return acc;
      }, []);
      return result;
    }

    return reduceDataByDate(hasData);
  }
}
