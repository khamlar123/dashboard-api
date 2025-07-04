import {
  Controller,
  DefaultValuePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImportService } from './import.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('loan')
  async importLoan(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.loanImport(start, end);
  }

  @Post('sector-bal')
  async importSectorBall(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.sectorBalImport(start, end);
  }

  @Post('bol-loan')
  async importLoanBol(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.loanBolImport(start, end);
  }

  @Post('income')
  async importIncome(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.incomeImport(start, end);
  }

  @Post('expense')
  async importExpense(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.expenseImport(start, end);
  }

  @Post('deposit')
  async importDeposit(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.depositImport(start, end);
  }

  @Post('admin')
  async importAdmin(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.adminImport(start, end);
  }

  @Post('liquidity')
  async importLiquidity(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.liquidity(start, end);
  }
}
