import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { IncomeCodeService } from './income_code.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('income-code')
export class IncomeCodeController {
  constructor(private readonly incomeCodeService: IncomeCodeService) {}

  // @Get()
  // async findAll() {
  //   return await this.incomeCodeService.findAll();
  // }
  //
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.incomeCodeService.findOne(id);
  // }
  //
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.incomeCodeService.remove(+id);
  // }
  //
  // @Post('import')
  // @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  // async uploadExcel(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new Error('No file uploaded');
  //   }
  //   return this.incomeCodeService.importData(file);
  // }
}
