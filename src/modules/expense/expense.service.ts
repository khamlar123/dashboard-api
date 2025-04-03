import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from '../../dto/create-expense.dto';
import { UpdateExpenseDto } from '../../dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/entity/expense.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly incomePlanRepository: Repository<Expense>,
  ) {}
  async create(dto: CreateExpenseDto): Promise<any> {
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

  async update(id: number, dto: UpdateExpenseDto) {
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
}
