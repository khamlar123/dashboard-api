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
import { CreateIncomeCodeDto } from '../../dto/create-income_code.dto';
import { UpdateIncomeCodeDto } from 'src/dto/update-income_code.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('income-code')
export class IncomeCodeController {
  constructor(private readonly incomeCodeService: IncomeCodeService) {}

  @Post()
  async create(@Body() dto: CreateIncomeCodeDto) {
    return await this.incomeCodeService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.incomeCodeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.incomeCodeService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateIncomeCodeDto) {
    return await this.incomeCodeService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.incomeCodeService.remove(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.incomeCodeService.importData(file);
  }
}
