import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CreateIncomePlanDto } from 'src/dto/create-income_plan.dto';
import { UpdateIncomePlanDto } from 'src/dto/update-income_plan.dto';
import { Branch } from 'src/entity/branch.entity';
import { IncomeCode } from 'src/entity/income_code.entity';
import { IncomePlan } from 'src/entity/income_plan.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class IncomePlanService {
  constructor(
    @InjectRepository(IncomePlan)
    private readonly incomePlanRepository: Repository<IncomePlan>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(IncomeCode)
    private readonly incomeCodeRepository: Repository<IncomeCode>,
  ) {}
  async create(dto: CreateIncomePlanDto): Promise<any> {
    try {
      return await this.incomePlanRepository.save(dto);
    } catch (e) {
      return e.message;
    }
  }

  async findAll() {
    try {
      const item = await this.incomePlanRepository.find();
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.incomePlanRepository.findOne({
        where: { id },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async update(id: number, dto: UpdateIncomePlanDto) {
    try {
      return await this.incomePlanRepository.update(id, dto);
    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    try {
      return await this.incomePlanRepository.delete(id);
    } catch (e) {
      return e.message;
    }
  }

  async importData(file: Express.Multer.File): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const [branches, incomeCodes] = await Promise.all([
      this.branchRepository.find({}),
      this.incomeCodeRepository.find({}),
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
          f.INC_CODE === e.INC_CODE,
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

    function getIncomeCode(code: string) {
      return incomeCodes.find(
        (i: any) => String(i.code).trim() === String(code).trim(),
      );
    }

    const mapData = plaList.map((m) => {
      const branch = getBranch(m.Branch);
      const incomeCode = getIncomeCode(m.INC_CODE);
      return {
        income_code: { id: incomeCode?.id },
        branch: { id: branch?.id },
        date: moment(m.Date).endOf('day').toDate(),
        amount: m['INC-PLAN'],
      };
    });

    return await this.incomePlanRepository.save(mapData);
  }
}
