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
import { FileInterceptor } from '@nestjs/platform-express';
import { IncomeDailyService } from './income-daily.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('income-daily')
export class IncomeDailyController {
  constructor(private readonly incomeDailyService: IncomeDailyService) {}
  @Get()
  @ApiQuery({ name: 'branch', required: false })
  @ApiQuery({ name: 'date', required: false })
  async findAll(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.incomeDailyService.findAll(branch, date);
  }

  @Get('by-date')
  async findByDate(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.incomeDailyService.findByDate(date);
  }

  @Get('by-branch')
  async findByBranch(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
  ) {
    return await this.incomeDailyService.findBranch(branch);
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
