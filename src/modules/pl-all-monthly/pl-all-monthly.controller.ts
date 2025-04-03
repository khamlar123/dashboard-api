import {
  Controller,
  Get,
  Post,
  Param,
  DefaultValuePipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PlAllMonthlyService } from './pl-all-monthly.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('pl-all-monthly')
export class PlAllMonthlyController {
  constructor(private readonly plAllMonthlyService: PlAllMonthlyService) {}

  @Get()
  @ApiQuery({ name: 'branch', required: false })
  @ApiQuery({ name: 'date', required: false })
  async findAll(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.plAllMonthlyService.findAll(branch, date);
  }

  @Get('by-month')
  async findByDate(
    @Query('month', new DefaultValuePipe(''))
    month: string,
  ) {
    return await this.plAllMonthlyService.findByMonth(month);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.plAllMonthlyService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.plAllMonthlyService.importData(file);
  }
}
