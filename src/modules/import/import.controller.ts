import {
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImportService } from './import.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('import')
@ApiBearerAuth()
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get()
  async getImport() {
    return await this.importService.getLastItem();
  }

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

  @Post('liquidity-exchange')
  async importLiquidityExchange(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.liquidityExchange(start, end);
  }

  @Post('liquidity-nop')
  async importLiquidityNop(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.liquidityNop(start, end);
  }

  @Post('reseve')
  async importReseve(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.reserve(start, end);
  }

  @Post('liquidity-cap-asset')
  async liquidityCapAsset(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.liquidityCapAsset(start, end);
  }

  @Post('loan-app')
  async loamApp(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.loanApp(start, end);
  }

  @Post('exchange-rate')
  async exchangeRate(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.exchangeRate(start, end);
  }

  @Post('account')
  async Account(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.importService.account(start, end);
  }
}
