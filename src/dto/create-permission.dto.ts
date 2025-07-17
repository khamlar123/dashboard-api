import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  name: string;
}
