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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('income')
@ApiBearerAuth()
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get('')
  async findIncome(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.incomeService.findIncome(date, branch, option);
  }

  @Get('/dailly')
  async findIncomeDailly(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.incomeService.findIncomeDailly(date, branch, option);
  }
}
