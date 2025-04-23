import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DatabaseService } from 'src/common/database/database.service';
import * as XLSX from 'xlsx';
import { reduceFunc } from '../../share/functions/reduce-func';

@Injectable()
export class ProfitService {
  constructor(private readonly dbServer: DatabaseService) {}

  // use char 4
  async getProfit(date: string): Promise<any> {
    //TODO: autoget day - 1
    const year = moment(date).format('YYYY');
    const query = `select b.code as Branch,
       b.name as Branch_name,
       pf.date as Date,
       nvl(pfp.profit_plan,0) as profit_plan,
       nvl(pf.profit_amount,0)  as profit_amount
      from branch b
      left outer join profit_plan  pfp on b.code=pfp.branchId and pfp.year = ${year}
      left outer join profit pf on b.code=pf.branchId
      where pf.date= ?`;

    const [result] = await this.dbServer.getProfit(query, [date]);
    const labels: string[] = [];
    const values: number[] = [];
    const plans: number[] = [];

    for (const e of result) {
      labels.push(e.Branch_name);
      values.push(Number(e.profit_amount));
      plans.push(Number(e.profit_plan));
    }

    return {
      labels,
      values,
      plans,
    };
  }

  async importData(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
    const newArray: any[] = [];

    const formattedData = jsonData.map((row: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.keys(row).forEach((key) => {
        if (typeof row?.Date === 'number' && row?.Date > 40000) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          row.Date = XLSX.SSF.format('yyyy-mm-dd', row?.Date);
        }
      });
      return row;
    });

    formattedData.forEach((f) => {
      const itx = {
        branchId: f.Branch,
        year: f.Date,
        profit_plan: f.Plan_branch,
        description: '',
      };

      if (newArray.length === 0) {
        newArray.push(itx);
      }
      const checkItem = newArray.find((f) => f.branchId === itx.branchId);
      if (!checkItem) {
        newArray.push(itx);
      }
    });

    const res: any[] = [];

    for (let index = 0; index < newArray.length; index++) {
      const element = newArray[index];
      const year = moment(element.year, 'yyyy-mm-dd').format('yyyy');
      const createItem = await this.dbServer.import(
        `INSERT INTO profit_plan (branchId, year, profit_plan, description) VALUES (?, ?, ?, ?)`,
        [
          element['branchId'],
          year,
          element['profit_plan'],
          element['description'],
        ],
      );

      res.push(createItem);
    }

    return res;
  }

  async profit(date: string, branchId: string): Promise<any> {
    //TODO: autoget day - 1
    const year = moment(date).format('YYYY');
    const query = `select b.code as Branch,
       b.name as Branch_name,
       pf.date as Date,
       nvl(pfp.profit_plan,0) as profit_plan,
       nvl(pf.profit_amount,0)  as profit_amount
      from branch b
      left outer join profit_plan  pfp on b.code=pfp.branchId and pfp.year = ${year}
      left outer join profit pf on b.code=pf.branchId
      where pf.date= ? ${branchId ? 'AND pf.branchId = ?' : ''}`;

    const [result] = await this.dbServer.getProfit(query, [date, branchId]);
    const planProfit: number[] = [];
    const Profit: number[] = [];
    let branchName: string = '';
    result.map((m) => {
      planProfit.push(Number(m.profit_plan));
      Profit.push(Number(m.profit_amount));
      branchName = m.Branch_name;
    });

    const resx = {
      branchName: branchId ? branchName : 'All branch',
      planProfitAmount: Number(reduceFunc(planProfit).toFixed(2)),
      profitAmount: Number(reduceFunc(Profit).toFixed(2)),
    };
    return resx;
  }
}
