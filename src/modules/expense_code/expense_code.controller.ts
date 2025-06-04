import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExpenseCodeService } from './expense_code.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('expense-code')
export class ExpenseCodeController {
  constructor(private readonly expenseCodeService: ExpenseCodeService) {}

  @Get()
  async findAll() {
    return await this.expenseCodeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.expenseCodeService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.expenseCodeService.remove(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.expenseCodeService.importData(file);
  }
}
