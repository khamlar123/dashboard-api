import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Treasure } from 'src/entity/treasure.entity';
import { checkNan } from 'src/share/check-nan';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class TreasureService {
  constructor(
    @InjectRepository(Treasure)
    private readonly treasure: Repository<Treasure>,
  ) {}
  async findAll() {
    try {
      const findAll = await this.treasure.find();
      return findAll;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: number) {
    try {
      const findOne = this.treasure.findOne({
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
        description: m.ເນື້ອໃນ,
        date: m.Date,
        amount: Math.abs(checkNan(m.Amount)),
      };
    });

    return await this.treasure.save(mapData);
  }

  async findByMonth(month: string): Promise<any> {
    try {
      const findByDate = await this.treasure.find({
        where: {
          date: month,
        },
      });
      return findByDate;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
