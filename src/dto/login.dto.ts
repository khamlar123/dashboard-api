import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: 'admin' })
  username: string;

  @ApiProperty({ default: 'Apb123456' })
  password: string;
}
