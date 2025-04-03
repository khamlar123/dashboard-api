import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty()
  code: number;

  @ApiProperty()
  name: string;
}
