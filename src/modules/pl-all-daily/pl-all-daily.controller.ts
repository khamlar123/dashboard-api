import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PlAllDailyService } from './pl-all-daily.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('pl-all-daily')
export class PlAllDailyController {
  constructor(private readonly plAllDailyService: PlAllDailyService) {}

  @Get()
  @ApiQuery({ name: 'branch', required: false })
  @ApiQuery({ name: 'date', required: false })
  async findAll(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.plAllDailyService.findAll(branch, date);
  }

  @Get('by-date')
  async findByDate(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.plAllDailyService.findByDate(date);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.plAllDailyService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.plAllDailyService.importData(file);
  }
}
