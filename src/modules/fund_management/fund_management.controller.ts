import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { FundManagementService } from './fund_management.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('fund-management')
export class FundManagementController {
  constructor(private readonly fundManagementService: FundManagementService) {}

  @Get('/plan-deposit')
  @ApiQuery({ name: 'branch', required: false })
  async planDeposit(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.fundManagementService.planDeposit(date, branch, option);
  }

  @Get('/plan-use-fund')
  @ApiQuery({ name: 'branch', required: false })
  async planUseFund(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.fundManagementService.planUseFund(date, branch, option);
  }

  @Get('/deposit-use-fund')
  @ApiQuery({ name: 'branch', required: false })
  async depositUseFund(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.fundManagementService.depositUseFund(
      date,
      branch,
      option,
    );
  }

  @Get('/ldr')
  @ApiQuery({ name: 'branch', required: false })
  async ldr(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.fundManagementService.ldr(date, branch, option);
  }

  @Get('/deposit-type')
  async depositByType(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.fundManagementService.depositByType(date);
  }

  @Get('/bol-loan')
  @ApiQuery({ name: 'branch', required: false })
  async bolLoan(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.fundManagementService.bolLoan(date, branch, option);
  }

  @Get('/liquidity')
  @ApiQuery({ name: 'branch', required: false })
  async liquidity(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.fundManagementService.liquidity(date, branch, option);
  }

  @Get('/banner')
  @ApiQuery({ name: 'branch', required: false })
  async Nop(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.fundManagementService.banner(date, branch, option);
  }
}
