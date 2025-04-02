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

@Controller('pl-all-monthly')
export class PlAllMonthlyController {
  constructor(private readonly plAllMonthlyService: PlAllMonthlyService) {}

  @Get()
  async findAll() {
    return await this.plAllMonthlyService.findAll();
  }

  @Get('by-date')
  async findByDate(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.plAllMonthlyService.findByDate(date);
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
