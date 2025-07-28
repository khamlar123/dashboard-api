import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { CreatePermissionDto } from '../../dto/create-permission.dto';

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

  @Get('user/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch('permission/toggle-status/:id')
  async permissionToggle(@Param('id') id: string) {
    return await this.userService.permissionToggleStatus(id);
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
