import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeetorPlanService } from './seetor_plan.service';

@Controller('seetor-plan')
export class SeetorPlanController {
  constructor(private readonly seetorPlanService: SeetorPlanService) {}
}
