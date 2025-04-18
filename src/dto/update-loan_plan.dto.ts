import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanPlanDto } from './create-loan_plan.dto';

export class UpdateLoanPlanDto extends PartialType(CreateLoanPlanDto) {}
