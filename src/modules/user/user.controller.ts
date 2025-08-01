import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { CreatePermissionDto } from '../../dto/create-permission.dto';
import { UpdateRoleDto } from '../../dto/update-role.dto';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('permission')
  async findActivePermission() {
    return await this.userService.findActivePermission();
  }

  @Get('roles')
  async findRole() {
    return await this.userService.findRole();
  }

  @Get('permission/:id')
  async findOnePermission(@Param('id') id: string) {
    return await this.userService.findOnePermission(Number(id));
  }

  @Get('role/:id')
  async findOneRole(@Param('id') id: string) {
    return await this.userService.findOneRole(Number(id));
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch('permission/toggle-status/:id')
  async permissionToggle(@Param('id') id: string) {
    return await this.userService.permissionToggleStatus(id);
  }

  @Patch('permission/update/:id')
  async permissionUpdate(
    @Param('id') id: string,
    @Body() dto: CreatePermissionDto,
  ) {
    return await this.userService.updatePermission(Number(id), dto.name);
  }

  @Patch('role/update/:id')
  async roleUpdate(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return await this.userService.updateRole(Number(id), dto);
  }

  @Post('create-permission')
  async permissionCreate(@Body() dto: CreatePermissionDto) {
    return await this.userService.createPermission(dto);
  }

  @Post('create-role')
  async createRole(@Body() dto: CreateRoleDto) {
    return await this.userService.createRole(dto);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.userService.update(Number(id), dto);
  }

  @Patch('/toggle-status/:empid')
  async toggleStatus(@Param('empid') empid: string) {
    return await this.userService.toggleStatus(empid);
  }
}
