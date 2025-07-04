import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HrService } from './hr.service';

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('banner')
  async banner() {
    return await this.hrService.hrBanner();
  }

  @Get('employee-sex')
  async employeeBySex() {
    return await this.hrService.employeeBySex();
  }

  @Get('employee-education')
  async employeeByEducation() {
    return await this.hrService.empEducation();
  }

  @Get('employee-position')
  async employeeByPosition() {
    return await this.hrService.empPosition();
  }

  @Get('employee-age')
  async employeeByAge() {
    return await this.hrService.empAge();
  }

  @Get('employee-branch')
  async employeeByBranch() {
    return await this.hrService.empBranch();
  }
}
