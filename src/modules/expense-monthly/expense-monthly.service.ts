import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { checkNan } from 'src/share/check-nan';
import { ExpenseMonthly } from 'src/entity/expense-monthly.entity';

@Injectable()
export class ExpenseMonthlyService {
  constructor(
    @InjectRepository(ExpenseMonthly)
    private readonly exp: Repository<ExpenseMonthly>,
  ) {}
  async findAll(branch: string, date: string) {
    try {
      const where: any = {};
      if (branch) {
        where.branch = branch;
      }

      if (date) {
        where.date = date;
      }
      const findAll = await this.exp.find({
        where,
      });
      return findAll;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findByMonth(month: string): Promise<any> {
    try {
      const findByDate = await this.exp.find({
        where: {
          date: month,
        },
      });
      return findByDate;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: number) {
    try {
      const findOne = this.exp.findOne({
        where: {
          id: id,
        },
      });
      return findOne;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async importData(file: Express.Multer.File): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const formattedData = jsonData.map((row: any) => {
      Object.keys(row).forEach((key) => {
        if (typeof row?.Date === 'number' && row?.Date > 40000) {
          // Likely a date, convert it
          row.Date = XLSX.SSF.format('mmm-yyyy', row?.Date);
        }
      });
      return row;
    });

    const mapData = formattedData.map((m) => {
      return {
        branch: m.Branch,
        name: m.ຊື່ສາຂາ,
        date: m.Date,
        exp_plan: checkNan(m['EXP-PLAN']),
        expense: checkNan(m.EXPENSE),
        exp_code: m.EXP_CODE,
        exp_desc: m.EXP_DES,
      };
    });

    //return mapData;

    return await this.exp.save(mapData);
  }
}
