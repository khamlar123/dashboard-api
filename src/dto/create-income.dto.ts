import { ApiProperty } from '@nestjs/swagger';

export class CreateIncomeDto {
  @ApiProperty()
  branch_id: number;

  @ApiProperty()
  income_code_id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  scaled_amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;
}
