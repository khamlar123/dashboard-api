import { Injectable } from '@nestjs/common';
import { CreateExpensePlanDto } from '../../dto/create-expense_plan.dto';
import { UpdateExpensePlanDto } from '../../dto/update-expense_plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpensePlan } from 'src/entity/expense_plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExpensePlanService {
  constructor(
    @InjectRepository(ExpensePlan)
    private readonly expensePlanRepository: Repository<ExpensePlan>,
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
}
