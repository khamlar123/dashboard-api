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
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from '../../dto/create-income.dto';
import { UpdateIncomeDto } from '../../dto/update-income.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  async create(@Body() dto: CreateIncomeDto) {
    return await this.incomeService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.incomeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.incomeService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateIncomeDto) {
    return await this.incomeService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.incomeService.remove(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.incomeService.importData(file);
  }
}
