import { Injectable } from '@nestjs/common';
import { CreateLoanPlanDto } from '../../dto/create-loan_plan.dto';
import { UpdateLoanPlanDto } from '../../dto/update-loan_plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanPlan } from '../../entity/loan_plan.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Branch } from '../../entity/branch.entity';
import * as moment from 'moment';

@Injectable()
export class LoanPlanService {
  constructor(
    @InjectRepository(LoanPlan)
    private readonly loanPlanRepository: Repository<LoanPlan>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async findAll() {
    return await this.loanPlanRepository.find({
      relations: { branch: true },
    });
  }

  async findOne(id: number) {
    return await this.loanPlanRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        branch: true,
      },
    });
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

    const findBranch = await this.branchRepository.find();

    function getBranch(code: string) {
      return findBranch.find(
        (b: any) => String(b.code).trim() === String(code).trim(),
      );
    }

    const plaList: any[] = [];

    formattedData.map((m) => {
      const year = moment(m.date).year();
      const branch = getBranch(m.Branch);

      const itx = {
        year: year,
        amount: Number(m.loan_plan),
        branch: { code: branch?.code },
        npl_plan: Number(m.Npl_plan),
      };

      const checkItem = plaList.find(
        (f) => f.branch.code === m.Branch && f.year === year,
      );

      if (!checkItem) {
        plaList.push(itx);
      }
    });
    return await this.loanPlanRepository.save(plaList);
  }
}
