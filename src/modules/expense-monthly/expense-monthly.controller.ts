import {
  Controller,
  Get,
  Post,
  Param,
  DefaultValuePipe,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExpenseMonthlyService } from './expense-monthly.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
@Controller('expense-monthly')
export class ExpenseMonthlyController {
  constructor(private readonly expenseMonthlyService: ExpenseMonthlyService) {}

  @Get()
  @ApiQuery({ name: 'branch', required: false })
  @ApiQuery({ name: 'date', required: false })
  findAll(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return this.expenseMonthlyService.findAll(branch, date);
  }

  @Get('by-month')
  async findByDate(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.expenseMonthlyService.findByMonth(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseMonthlyService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.expenseMonthlyService.importData(file);
  }
}
