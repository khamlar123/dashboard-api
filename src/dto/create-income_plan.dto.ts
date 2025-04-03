import { ApiProperty } from '@nestjs/swagger';

export class CreateIncomePlanDto {
  @ApiProperty()
  income_code_id: number;

  @ApiProperty()
  branch_id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  amount: number;
}
