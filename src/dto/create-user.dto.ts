import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

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

  @ApiProperty({
    enum: ['user', 'admin'],
    description: 'Role of the user',
  })
  @IsEnum(['user', 'admin'], { message: 'role must be either user or admin' })
  role: 'user' | 'admin';

  @ApiProperty()
  permissions: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;
}
