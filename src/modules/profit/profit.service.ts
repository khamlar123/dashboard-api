import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DatabaseService } from 'src/database/database.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ProfitService {
  constructor(private readonly dbServer: DatabaseService) {}

  async getProfit(date: string): Promise<any> {
    const query = `select b.code as Branch,
       b.name as Branch_name,
       pf.date as Date,
       nvl(pfp.profit_plan,0) as profit_plan,
       nvl(pf.profit_amount,0)  as profit_amount
      from branch b
      left outer join profit_plan  pfp on b.code=pfp.branchId and pfp.year = DATE_FORMAT(${date},'%Y')
      left outer join profit pf on b.code=pf.branchId
      where pf.date= ?`;

    const [result] = await this.dbServer.getProfit(query, date);
    return result;
  }

  async importData(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
    const newArray: any[] = [];

    const formattedData = jsonData.map((row: any) => {
      Object.keys(row).forEach((key) => {
        if (typeof row?.Date === 'number' && row?.Date > 40000) {
          // Likely a date, convert it
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
}
