import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from '../../dto/create-expense.dto';
import { UpdateExpenseDto } from '../../dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/entity/expense.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Branch } from 'src/entity/branch.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';
@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(ExpenseCode)
    private readonly expenseCodeRepository: Repository<ExpenseCode>,
  ) {}
  async create(dto: CreateExpenseDto): Promise<any> {
    try {
      return await this.expenseRepository.save(dto);
    } catch (e) {
      return e.message;
    }
  }

  async findAll() {
    try {
      const item = await this.expenseRepository.find();
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.expenseRepository.findOne({
        where: { id },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async update(id: number, dto: UpdateExpenseDto) {
    try {
      return await this.expenseRepository.update(id, dto);
    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    try {
      return await this.expenseRepository.delete(id);
    } catch (e) {
      return e.message;
    }
  }

  async importData(file: Express.Multer.File): Promise<any[]> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

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

    const mapData = jsonData.map((m: any) => {
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
    return addItems;
  }
}
