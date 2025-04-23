import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from '../../dto/create-income.dto';
import { UpdateIncomeDto } from '../../dto/update-income.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/entity/income.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as XLSX from 'xlsx';
import { Branch } from 'src/entity/branch.entity';
import { IncomeCode } from 'src/entity/income_code.entity';
import * as moment from 'moment';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(IncomeCode)
    private readonly incomeCodeRepository: Repository<IncomeCode>,
  ) {}

  async create(dto: CreateIncomeDto): Promise<Income> {
    try {
      const {
        branch_id,
        income_code_id,
        amount,
        scaled_amount,
        description,
        date,
      } = dto;

      const req = {
        branch: { code: branch_id },
        amount,
        scaled_amount,
        date,
        income_code: { id: income_code_id },
        description,
      };

      return await this.incomeRepository.save(req);
    } catch (e) {
      return e.message;
    }
  }

  async findAll() {
    try {
      await this.incomeRepository.find();
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: number): Promise<Income | null> {
    try {
      const item = await this.incomeRepository.findOne({
        where: { id },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async update(id: number, dto: UpdateIncomeDto): Promise<UpdateResult> {
    try {
      const update = await this.incomeRepository.update(id, dto);
      return update;
    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      const remove = await this.incomeRepository.delete(id);
      return remove;
    } catch (e) {
      return e.message;
    }
  }

  async importData(file: Express.Multer.File): Promise<any[]> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const [branches, incomeCodes] = await Promise.all([
      this.branchRepository.find({}),
      this.incomeCodeRepository.find({}),
    ]);

    function getBranch(code: string) {
      return branches.find((b: any) => String(b.code) === code);
    }

    function getIncomeCode(code: string) {
      return incomeCodes.find((i: any) => String(i.code) === String(code));
    }

    const mapData = jsonData.map((m: any) => {
      const branch = getBranch(m.branch_code.padEnd(6, '0'));
      const incomeCode = getIncomeCode(m.id);
      return {
        branch: branch,
        amount: m.bal,
        scaled_amount: m.balM,
        date: moment(m.ac_date, 'YYYYMMDD').endOf('day').format('YYYY-MM-DD'),
        income_code: incomeCode,
        description: '',
      };
    });

    const addItems = await this.incomeRepository.save(mapData);
    return addItems;
  }
}
