import {
  Controller,
  Get,
  Post,
  Param,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { InExProYearService } from './in_ex_pro_year.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('in-ex-pro-year')
export class InExProYearController {
  constructor(private readonly inExProYearService: InExProYearService) {}

  @Get()
  findAll() {
    return this.inExProYearService.findAll();
  }

  @Get('by-date')
  async findByDate(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.inExProYearService.findByDate(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inExProYearService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.inExProYearService.importData(file);
  }
}
