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
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('deposit')
@ApiBearerAuth()
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  // @Get('')
  // @ApiQuery({ name: 'branch', required: false })
  // async test(
  //   @Query('date', new DefaultValuePipe(''))
  //   date: string,
  //   @Query('branch', new DefaultValuePipe(''))
  //   branch: string,
  //   @Query('option', new DefaultValuePipe(''))
  //   option: 'd' | 'm' | 'y',
  // ) {
  //   return await this.depositService.deposit(date, option, branch);
  // }
}
