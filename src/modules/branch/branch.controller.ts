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
  UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  //@UseGuards(AuthGuard)
  async findAll() {
    return await this.branchService.findAll();
  }

  // @Get('income')
  // @ApiQuery({ name: 'bcode', required: false })
  // async income(
  //   @Query('bcode', new DefaultValuePipe(''))
  //   bcode: string,
  //   @Query('date', new DefaultValuePipe(''))
  //   date: string,
  // ) {
  //   return await this.branchService.income(bcode, date);
  // }
  //
  // @Get('income-percent')
  // @ApiQuery({ name: 'bcode', required: false })
  // async incomePercent(
  //   @Query('bcode', new DefaultValuePipe(''))
  //   bcode: string,
  //   @Query('date', new DefaultValuePipe(''))
  //   date: string,
  // ) {
  //   return await this.branchService.getIncomePercent(bcode, date);
  // }
  //
  // @Get('expense-percent')
  // @ApiQuery({ name: 'bcode', required: false })
  // async expensePercent(
  //   @Query('bcode', new DefaultValuePipe(''))
  //   bcode: string,
  //   @Query('date', new DefaultValuePipe(''))
  //   date: string,
  // ) {
  //   return await this.branchService.getExpensePercent(bcode, date);
  // }
  //
  // @Get('income-all')
  // async incomeAll(
  //   @Query('date', new DefaultValuePipe(''))
  //   date: string,
  // ) {
  //   return await this.branchService.incomeAll(date);
  // }
  //
  // @Get('profit-day')
  // @ApiQuery({ name: 'bcode', required: false })
  // async incomeDay(
  //   @Query('date', new DefaultValuePipe(0))
  //   date: string,
  //   @Query('bcode', new DefaultValuePipe(''))
  //   bcode: string,
  // ) {
  //   return await this.branchService.getPlanProfitDay(date, bcode);
  // }
  //
  // @Get('profit-month')
  // @ApiQuery({ name: 'bcode', required: false })
  // async incomeMonth(
  //   @Query('date', new DefaultValuePipe(0))
  //   date: string,
  //   @Query('bcode', new DefaultValuePipe(''))
  //   bcode: string,
  // ) {
  //   return await this.branchService.getPlanProfitMonthly(date, bcode);
  // }
  //
  // @Get('profit-year')
  // @ApiQuery({ name: 'bcode', required: false })
  // async incomeYear(
  //   @Query('year', new DefaultValuePipe(0))
  //   year: number,
  //   @Query('bcode', new DefaultValuePipe(''))
  //   bcode: string,
  // ) {
  //   return await this.branchService.getPlanProfitYear(year, bcode);
  // }
  //
  // @Get('expense')
  // @ApiQuery({ name: 'bcode', required: false })
  // async expense(
  //   @Query('bcode', new DefaultValuePipe(''))
  //   bcode: string,
  //   @Query('date', new DefaultValuePipe(''))
  //   date: string,
  // ) {
  //   return await this.branchService.expense(bcode, date);
  // }
  //
  // @Get('expense-all')
  // async expenseAll(
  //   @Query('date', new DefaultValuePipe(''))
  //   date: string,
  // ) {
  //   return await this.branchService.expenseAll(date);
  // }
  //
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.branchService.findOne(+id);
  // }
  //
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.branchService.remove(+id);
  // }
  //
  // @Post('import')
  // @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  // async uploadExcel(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new Error('No file uploaded');
  //   }
  //   return this.branchService.importData(file);
  // }
}
