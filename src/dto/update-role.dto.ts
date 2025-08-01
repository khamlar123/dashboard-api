import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  is_active?: boolean;

  @ApiProperty()
  permissions?: number[]; // array of permission IDs to assign
}
