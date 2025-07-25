import { Controller, Get, Query, DefaultValuePipe } from '@nestjs/common';
import { IncomePlanService } from './income_plan.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('income-plan')
@ApiBearerAuth()
export class IncomePlanController {
  constructor(private readonly incomePlanService: IncomePlanService) {}

  @Get('/dailly')
  async findPlanDailly(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.incomePlanService.findPlanIncome(date, branch);
  }
}
