import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExpenseDailyService } from './expense-daily.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('expense-daily')
export class ExpenseDailyController {
  constructor(private readonly expenseDailyService: ExpenseDailyService) {}

  @Get()
  findAll() {
    return this.expenseDailyService.findAll();
  }

  @Get('by-date')
  async findByDate(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.expenseDailyService.findByDate(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseDailyService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.expenseDailyService.importData(file);
  }
}
