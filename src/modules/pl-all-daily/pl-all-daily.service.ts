import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlAllDaily } from 'src/entity/pl-all-daily.entity';
import { checkNan } from 'src/share/check-nan';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class PlAllDailyService {
  constructor(
    @InjectRepository(PlAllDaily)
    private readonly pl: Repository<PlAllDaily>,
  ) {}
  async findAll() {
    try {
      const findAll = await this.pl.find();
      return findAll;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findByDate(date: string): Promise<any> {
    try {
      const findByDate = await this.pl.find({
        where: {
          date,
        },
      });
      return findByDate;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: number) {
    try {
      const findOne = this.pl.findOne({
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
        name: m.name,
        date: m.Date,
        plan_branch: Math.abs(checkNan(m.Plan_branch)),
        amount: Math.abs(checkNan(m.Amount)),
      };
    });

    return await this.pl.save(mapData);
  }
}
