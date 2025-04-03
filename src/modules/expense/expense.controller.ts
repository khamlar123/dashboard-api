import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from '../../dto/create-expense.dto';
import { UpdateExpenseDto } from '../../dto/update-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(@Body() dto: CreateExpenseDto) {
    return await this.expenseService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.expenseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.expenseService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return await this.expenseService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.expenseService.remove(+id);
  }
}
