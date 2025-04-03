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
import { CreateExpenseCodeDto } from '../../dto/create-expense_code.dto';
import { UpdateExpenseCodeDto } from '../../dto/update-expense_code.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('expense-code')
export class ExpenseCodeController {
  constructor(private readonly expenseCodeService: ExpenseCodeService) {}
  @Post()
  async create(@Body() dto: CreateExpenseCodeDto) {
    return await this.expenseCodeService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.expenseCodeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.expenseCodeService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExpenseCodeDto) {
    return await this.expenseCodeService.update(+id, dto);
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
