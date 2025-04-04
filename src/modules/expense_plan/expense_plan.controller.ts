import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ExpensePlanService } from './expense_plan.service';
import { CreateExpensePlanDto } from '../../dto/create-expense_plan.dto';
import { UpdateExpensePlanDto } from '../../dto/update-expense_plan.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.expensePlanService.importData(file);
  }
}
