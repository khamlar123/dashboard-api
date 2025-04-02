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
@Controller('expense-monthly')
export class ExpenseMonthlyController {
  constructor(private readonly expenseMonthlyService: ExpenseMonthlyService) {}

  @Get()
  findAll() {
    return this.expenseMonthlyService.findAll();
  }

  @Get('by-date')
  async findByDate(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.expenseMonthlyService.findByDate(date);
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
