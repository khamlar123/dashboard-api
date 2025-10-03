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
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('group1')
  async group1(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.mainService.group1(date);
  }

  @Get('group2')
  async group2(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.mainService.group2(date);
  }

  @Get('group3')
  async group3(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.mainService.group3(date);
  }

  @Get('group4')
  async group4(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.mainService.group4(date);
  }

  @Get('group5')
  async group5(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.mainService.group5(date);
  }

  @Get('group6')
  async group6(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.mainService.group6(date);
  }
}
