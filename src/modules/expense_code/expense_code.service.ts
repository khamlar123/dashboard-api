import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseCode } from 'src/entity/expense_code.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class ExpenseCodeService {
  constructor(
    @InjectRepository(ExpenseCode)
    private readonly expenseCodeRepository: Repository<ExpenseCode>,
  ) {}

  async findAll() {
    try {
      const item = await this.expenseCodeRepository.find();
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.expenseCodeRepository.findOne({
        where: { code: id },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    try {
      return await this.expenseCodeRepository.delete(id);
    } catch (e) {
      return e.message;
    }
  }

  async importData(file: Express.Multer.File): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const mapData = jsonData.map((m) => {
      return {
        code: m.code,
        description: m.desc,
      };
    });

    return await this.expenseCodeRepository.save(mapData);
  }
}
