import { ApiProperty } from '@nestjs/swagger';

export class CreateIncomeCodeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  description: string;
}
