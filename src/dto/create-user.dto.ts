import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { RoleEnum } from '../common/enums/role.enum';

export enum RoleType {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  employee_id: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ enum: RoleEnum })
  role: RoleEnum;

  @ApiProperty()
  name: string;

  @ApiProperty()
  branch_id: number;

  @ApiProperty()
  @IsOptional()
  is_admin?: boolean;

  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;
}
