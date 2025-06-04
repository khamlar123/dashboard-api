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
import { DepositService } from './deposit.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Get('')
  @ApiQuery({ name: 'currency', required: false })
  async profit(
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('currency', new DefaultValuePipe(''))
    currency: '',
  ) {
    return await this.depositService.deposit(date, currency);
  }
}
