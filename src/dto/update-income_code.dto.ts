import { PartialType } from '@nestjs/mapped-types';
import { CreateIncomeCodeDto } from './create-income_code.dto';

export class UpdateIncomeCodeDto extends PartialType(CreateIncomeCodeDto) {}
