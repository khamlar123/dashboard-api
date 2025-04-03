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
import { IncomePlanService } from './income_plan.service';
import { CreateIncomePlanDto } from 'src/dto/create-income_plan.dto';
import { UpdateIncomePlanDto } from 'src/dto/update-income_plan.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('income-plan')
export class IncomePlanController {
  constructor(private readonly incomePlanService: IncomePlanService) {}

  @Post()
  async create(@Body() dto: CreateIncomePlanDto) {
    return await this.incomePlanService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.incomePlanService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.incomePlanService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateIncomePlanDto) {
    return await this.incomePlanService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.incomePlanService.remove(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.incomePlanService.importData(file);
  }
}
