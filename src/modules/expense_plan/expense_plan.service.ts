import { Injectable } from '@nestjs/common';
import { CreateExpensePlanDto } from '../../dto/create-expense_plan.dto';
import { UpdateExpensePlanDto } from '../../dto/update-expense_plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpensePlan } from 'src/entity/expense_plan.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Branch } from 'src/entity/branch.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';

@Injectable()
export class ExpensePlanService {
  constructor(
    @InjectRepository(ExpensePlan)
    private readonly expensePlanRepository: Repository<ExpensePlan>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(ExpenseCode)
    private readonly expenseCodeRepository: Repository<ExpenseCode>,
  ) {}
  async create(dto: CreateExpensePlanDto): Promise<any> {
    try {
      return await this.expensePlanRepository.save(dto);
    } catch (e) {
      return e.message;
    }
  }

  async findAll() {
    try {
      const item = await this.expensePlanRepository.find();
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.expensePlanRepository.findOne({
        where: { id },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async update(id: number, dto: UpdateExpensePlanDto) {
    try {
      return await this.expensePlanRepository.update(id, dto);
    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    try {
      return await this.expensePlanRepository.delete(id);
    } catch (e) {
      return e.message;
    }
  }

  async importData(file: Express.Multer.File): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const [branches, expenseCodes] = await Promise.all([
      this.branchRepository.find({}),
      this.expenseCodeRepository.find({}),
    ]);

    const formattedData = jsonData.map((row: any) => {
      Object.keys(row).forEach((key) => {
        if (typeof row?.Date === 'number' && row?.Date > 40000) {
          // Likely a date, convert it
          row.Date = XLSX.SSF.format('dd-mm-yyyy', row?.Date);
        }
      });
      return row;
    });

    const plaList: any[] = [];

    formattedData.forEach((e) => {
      const year = moment(e.date).year();
      const checkItem = plaList.find(
        (f) =>
          f.Branch === e.Branch &&
          moment(f.date).year() === year &&
          f.EXP_CODE === e.EXP_CODE,
      );

      if (!checkItem) {
        plaList.push(e);
      }
    });

    function getBranch(code: string) {
      return branches.find(
        (b: any) => String(b.code).trim() === String(code).trim(),
      );
    }

    function getExpenseCode(code: string) {
      return expenseCodes.find(
        (i: any) => String(i.code).trim() === String(code).trim(),
      );
    }

    const mapData = plaList.map((m) => {
      const branch = getBranch(m.Branch);
      const expenseCode = getExpenseCode(m.EXP_CODE);
      return {
        expense_code: { id: expenseCode?.id },
        branch: { code: branch?.code },
        year: moment(m.Date).year().toString(),
        amount: m['EXP-PLAN'],
      };
    });

    return await this.expensePlanRepository.save(mapData);
  }
}
