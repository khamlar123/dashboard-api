import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { IncomeDaily } from 'src/entity/income-daily.entity';
import { checkNan } from 'src/share/check-nan';
import { Repository } from 'typeorm';
const { Readable } = require('stream');
import * as XLSX from 'xlsx';

@Injectable()
export class IncomeDailyService {
  constructor(
    @InjectRepository(IncomeDaily)
    private readonly inc: Repository<IncomeDaily>,
  ) {}
  async findAll() {
    try {
      const findAll = await this.inc.find();
      return findAll;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findByDate(date: string): Promise<any> {
    try {
      const findByDate = await this.inc.find({
        where: {
          date,
        },
      });
      return findByDate;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    try {
      const findOne = this.inc.findOne({
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
          row.Date = XLSX.SSF.format('dd-mm-yyyy', row?.Date);
        }
      });
      return row;
    });

    const mapData = formattedData.map((m) => {
      return {
        branch: m.Branch,
        name: m.ຊື່ສາຂາ,
        date: m.Date,
        inc_plan: checkNan(m['INC-PLAN']),
        income: checkNan(m.INCOME),
        inc_code: m.INC_CODE,
        inc_desc: m.INC_DES,
      };
    });

    //return mapData;

    return await this.inc.save(mapData);
  }
}
