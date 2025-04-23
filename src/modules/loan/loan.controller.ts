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
import { LoanService } from './loan.service';
import { CreateLoanDto } from '../../dto/create-loan.dto';
import { UpdateLoanDto } from '../../dto/update-loan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from '../../dto/login.dto';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Get()
  findAll() {
    return this.loanService.findAll();
  }

  @Get('daily')
  @ApiQuery({ name: 'bcode', required: false })
  async loanDay(
    @Query('date', new DefaultValuePipe(0))
    date: string,
    @Query('bcode', new DefaultValuePipe(''))
    bcode: string,
  ) {
    return await this.loanService.findLoanDaily(bcode, date);
  }

  @Get('monthly')
  @ApiQuery({ name: 'bcode', required: false })
  async loanMonth(
    @Query('date', new DefaultValuePipe(0))
    date: string,
    @Query('bcode', new DefaultValuePipe(''))
    bcode: string,
  ) {
    return await this.loanService.findLoanDataByMonth(bcode, date);
  }

  @Get('yearly')
  @ApiQuery({ name: 'bcode', required: false })
  async loanYear(
    @Query('date', new DefaultValuePipe(0))
    date: string,
    @Query('bcode', new DefaultValuePipe(''))
    bcode: string,
  ) {
    return await this.loanService.findLoanYearly(bcode, date);
  }

  @Get('all')
  @ApiQuery({ name: 'date', required: false })
  async loanAll(
    @Query('date', new DefaultValuePipe(0))
    date: string,
  ) {
    return await this.loanService.findLoanAll(date);
  }

  @Get('total')
  @ApiQuery({ name: 'date', required: false })
  async loanTotal(
    @Query('date', new DefaultValuePipe(0))
    date: string,
    @Query('bcode', new DefaultValuePipe(0))
    bcode: string,
  ) {
    return await this.loanService.totalLoan(date, bcode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.loanService.importData(file);
  }
}
