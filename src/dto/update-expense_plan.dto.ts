import { PartialType } from '@nestjs/mapped-types';
import { CreateExpensePlanDto } from './create-expense_plan.dto';

export class UpdateExpensePlanDto extends PartialType(CreateExpensePlanDto) {}
