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
import { ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@Controller('financial')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/plan')
  async Plan(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.adminService.adminPlan(date, branch, option);
  }

  @Get('/office-expense')
  async OfficeExpense(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.adminService.officeExpense(date, branch, option);
  }

  @Get('/total-assets')
  async TotalAssets(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.adminService.totalAssets(date, branch, option);
  }
}
