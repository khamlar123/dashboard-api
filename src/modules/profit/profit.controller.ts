import {
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfitService } from './profit.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('profit')
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}

  @Get()
  async getProfit(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.profitService.getProfit(date);
  }

  @Get('total-profit')
  @ApiQuery({ name: 'bcode', required: false })
  async totalProfit(
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('bcode', new DefaultValuePipe(''))
    bcode: string,
  ) {
    return await this.profitService.profit(date, bcode);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return await this.profitService.importData(file);
  }
}
