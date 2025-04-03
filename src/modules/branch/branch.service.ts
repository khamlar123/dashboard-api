import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from '../../dto/create-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/entity/branch.entity';
import { Repository } from 'typeorm';
import { UpdateBranchDto } from 'src/dto/update-branch.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(dto: CreateBranchDto): Promise<any> {
    try {
      return await this.branchRepository.save(dto);
    } catch (e) {
      return e.message;
    }
  }

  async findAll() {
    try {
      const item = await this.branchRepository.find();
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.branchRepository.findOne({
        where: { id },
      });
      return item;
    } catch (e) {
      return e.message;
    }
  }

  async update(id: number, dto: UpdateBranchDto) {
    try {
      return await this.branchRepository.update(id, dto);
    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    try {
      return await this.branchRepository.delete(id);
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
        code: m.Branch,
        name: m.nameB,
      };
    });

    return await this.branchRepository.save(mapData);
  }
}
