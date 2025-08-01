import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from '@nestjs/class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber()
  permissions: number[];
}
