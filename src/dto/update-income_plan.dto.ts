import { PartialType } from '@nestjs/mapped-types';
import { CreateIncomePlanDto } from './create-income_plan.dto';

export class UpdateIncomePlanDto extends PartialType(CreateIncomePlanDto) {}
