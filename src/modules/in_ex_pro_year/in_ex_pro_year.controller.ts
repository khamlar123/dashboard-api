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
import { ApiQuery } from '@nestjs/swagger';

@Controller('in-ex-pro-year')
export class InExProYearController {
  constructor(private readonly inExProYearService: InExProYearService) {}

  @Get()
  @ApiQuery({ name: 'branch', required: false })
  @ApiQuery({ name: 'year', required: false })
  findAll(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    year: string,
  ) {
    return this.inExProYearService.findAll(branch, year);
  }

  @Get('by-year')
  async findByDate(
    @Query('year', new DefaultValuePipe(''))
    year: string,
  ) {
    return await this.inExProYearService.findByYear(year);
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
