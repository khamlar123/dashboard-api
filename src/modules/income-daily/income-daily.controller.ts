import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  Post,
  UploadedFile,
} from '@nestjs/common';
import moment from 'moment';
import { FileInterceptor } from '@nestjs/platform-express';
import { IncomeDailyService } from './income-daily.service';

@Controller('income-daily')
export class IncomeDailyController {
  constructor(private readonly incomeDailyService: IncomeDailyService) {}
  @Get()
  async findAll() {
    return await this.incomeDailyService.findAll();
  }

  @Get('by-date')
  async findByDate(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.incomeDailyService.findByDate(date);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.incomeDailyService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.incomeDailyService.importData(file);
  }
}
