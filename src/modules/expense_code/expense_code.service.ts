import { Injectable } from '@nestjs/common';
import { CreateExpenseCodeDto } from '../../dto/create-expense_code.dto';
import { UpdateExpenseCodeDto } from '../../dto/update-expense_code.dto';
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
  async create(dto: CreateExpenseCodeDto): Promise<any> {
    try {
      return await this.expenseCodeRepository.save(dto);
    } catch (e) {
      return e.message;
    }
  }

  async findAll() {
    try {
      const item = await this.expenseCodeRepository.find();
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.expenseCodeRepository.findOne({
        where: { id },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async update(id: number, dto: UpdateExpenseCodeDto) {
    try {
      return await this.expenseCodeRepository.update(id, dto);
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
