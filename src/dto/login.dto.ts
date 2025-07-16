import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: '01633' })
  employee_id: string;

  @ApiProperty({ default: '123456' })
  password: string;
}
