import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpensePlanService } from './expense_plan.service';
import { CreateExpensePlanDto } from '../../dto/create-expense_plan.dto';
import { UpdateExpensePlanDto } from '../../dto/update-expense_plan.dto';

@Controller('expense-plan')
export class ExpensePlanController {
  constructor(private readonly expensePlanService: ExpensePlanService) {}

  @Post()
  async create(@Body() dto: CreateExpensePlanDto) {
    return await this.expensePlanService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.expensePlanService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.expensePlanService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExpensePlanDto) {
    return await this.expensePlanService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.expensePlanService.remove(+id);
  }
}
