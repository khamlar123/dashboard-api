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
import { PaidService } from './paid.service';

@Controller()
export class PaidController {
  constructor(private readonly paidService: PaidService) {}

  @Get('/paid')
  async planNplDaily(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: string,
  ) {
    return await this.paidService.paid(date, branch, option);
  }
}
