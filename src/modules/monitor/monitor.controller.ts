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
import { MonitorService } from './monitor.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('monitor')
@ApiBearerAuth()
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get('/profit')
  async depositType(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.profit(date, fixDay);
  }

  @Get('/credit-balance')
  async CreditBalance(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.creditBalance(date, fixDay);
  }

  @Get('/deposit')
  async DepositBalance(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.deposit(date, fixDay);
  }

  @Get('/exchange')
  async Exchange(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.exchange(date, fixDay);
  }

  @Get('/liquidity')
  async liquidity(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.liquidity(date, fixDay);
  }

  @Get('/alc')
  async alc(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.alc(date, fixDay);
  }

  @Get('/property')
  async property(
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
  ) {
    return await this.monitorService.property(date, branch, option);
  }

  @Get('/bd-deposit')
  async dbDeposit(
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
  ) {
    return await this.monitorService.bdDeposit(date, branch, option);
  }

  @Get('/use-funding')
  async useFunding(
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
  ) {
    return await this.monitorService.useFunding(date, branch, option);
  }

  @Get('/capital')
  async capital(
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
  ) {
    return await this.monitorService.capital(date, branch, option);
  }
}
