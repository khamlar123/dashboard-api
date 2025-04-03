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
import { IncomeMonthlyService } from './income-monthly.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('income-monthly')
export class IncomeMonthlyController {
  constructor(private readonly incomeMonthlyService: IncomeMonthlyService) {}

  @Get()
  @ApiQuery({ name: 'branch', required: false })
  @ApiQuery({ name: 'date', required: false })
  async findAll(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.incomeMonthlyService.findAll(branch, date);
  }

  @Get('by-date')
  async findByDate(
    @Query('month', new DefaultValuePipe(''))
    month: string,
  ) {
    return await this.incomeMonthlyService.findByMonth(month);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.incomeMonthlyService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.incomeMonthlyService.importData(file);
  }
}
