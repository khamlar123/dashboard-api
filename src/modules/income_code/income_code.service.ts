import { Injectable } from '@nestjs/common';
import { CreateIncomeCodeDto } from '../../dto/create-income_code.dto';
import { UpdateIncomeCodeDto } from '../../dto/update-income_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomeCode } from 'src/entity/income_code.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class IncomeCodeService {
  constructor(
    @InjectRepository(IncomeCode)
    private readonly incomeCodeRepository: Repository<IncomeCode>,
  ) {}
  async create(dto: CreateIncomeCodeDto): Promise<any> {
    try {
      return await this.incomeCodeRepository.save(dto);
    } catch (e) {
      return e.message;
    }
  }

  async findAll() {
    try {
      const item = await this.incomeCodeRepository.find();
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.incomeCodeRepository.findOne({
        where: { id },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async update(id: number, dto: UpdateIncomeCodeDto) {
    try {
      return await this.incomeCodeRepository.update(id, dto);
    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    try {
      return await this.incomeCodeRepository.delete(id);
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

    return await this.incomeCodeRepository.save(mapData);
  }
}
