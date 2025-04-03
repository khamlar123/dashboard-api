import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseCodeDto } from './create-expense_code.dto';

export class UpdateExpenseCodeDto extends PartialType(CreateExpenseCodeDto) {}
