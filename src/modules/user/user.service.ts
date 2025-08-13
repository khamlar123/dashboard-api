import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, RoleType } from '../../dto/create-user.dto';
import { genHash } from '../../share/functions/hash-unity';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { NotFoundError } from 'rxjs';
import { Role } from '../../entity/role.entity';
import { Permission } from '../../entity/permission.entity';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { UpdateRoleDto } from '../../dto/update-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRes: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRes: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRes: Repository<Permission>,
  ) {}

  async createPermission(dto: { name: string }): Promise<any> {
    const findItem = await this.permissionRes.findOne({
      where: {
        name: dto.name,
      },
    });

    if (findItem) {
      throw new ConflictException(
        'Duplicate entry: this record already exists.',
      );
    }

    const user = this.userRes.create(dto);
    return await this.permissionRes.save(user);
  }

  async findActivePermission(): Promise<any> {
    return await this.permissionRes.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async findOnePermission(id: number): Promise<any> {
    const findItem = await this.permissionRes.findOne({
      where: {
        id: id,
      },
    });

    if (!findItem) {
      throw new NotFoundError('permission not found');
    }

    return findItem;
  }

  async updatePermission(id: number, name: string): Promise<any> {
    const updateItem = await this.permissionRes.update(
      { id: id },
      { name: name },
    );
    return updateItem.raw > 0 ? 'Updated successfully.' : 'Updated error';
  }

  async permissionToggleStatus(id: string): Promise<any> {
    const findPermission = await this.permissionRes.findOne({
      where: { id: Number(id) },
    });

    if (!findPermission) {
      throw new NotFoundError('User not found');
    }

    const isActive = findPermission.is_active ? false : true;

    const update = await this.permissionRes.update(
      { id: Number(id) },
      { is_active: isActive },
    );

    return (update.affected as number) > 0
      ? `Change status to ${isActive ? 'active' : 'inactive'} successfully`
      : 'Change Status Failed';
  }

  async createRole(dto: CreateRoleDto) {
    const create = await this.roleRes.create({ name: dto.name });
    create.permissions = await this.permissionRes.findByIds(dto.permissions);
    return await this.roleRes.save(create);
  }

  async updateRole(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRes.findOne({
      where: { id },
      relations: ['permissions'], // include existing permissions
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Update name or is_active if provided
    if (dto.name !== undefined) role.name = dto.name;
    if (dto.is_active !== undefined) role.is_active = dto.is_active;

    // If permission IDs are provided, load Permission entities and assign
    if (dto.permissions && dto.permissions.length > 0) {
      const myPermissions = await this.permissionRes.findByIds(dto.permissions);
      role.permissions = myPermissions;
    }

    return this.roleRes.save(role);
  }

  async findRole(): Promise<any> {
    try {
      return await this.roleRes.find({
        relations: ['permissions'],
      });
    } catch (e) {
      return e.message;
    }
  }

  async findOneRole(id: number): Promise<any> {
    try {
      return await this.roleRes.findOne({
        where: {
          id: id,
        },
        relations: ['permissions'],
      });
    } catch (e) {
      return e.message;
    }
  }

  async findAll(): Promise<any> {
    try {
      return await this.userRes.find({
        order: {
          id: 'DESC',
        },
      });
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      return await this.userRes.findOne({
        where: {
          id: Number(id),
        },
        relations: ['role', 'role.permissions'],
      });
    } catch (e) {
      return e.message;
    }
  }

  async create(dto: CreateUserDto): Promise<any> {
    const hasPassword = await genHash(dto.password);
    const model = this.userRes.create({
      employee_id: dto.employee_id,
      password: hasPassword,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      is_active: true,
      is_admin: dto.is_admin,
      // role_id: dto.role_id,
      branch_id: dto.branch_id, // or dto.branch if that's ID
    });

    return await this.userRes.save(model);
  }

  async update(id: number, dto: UpdateUserDto): Promise<any> {
    if (dto.password) {
      dto.password = await genHash(dto.password);
    }
    try {
      const updated = await this.userRes.update({ id: id }, dto);
      return (updated.affected ?? 0) > 0 ? id : 0;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async toggleStatus(id: string): Promise<any> {
    const findUser = await this.userRes.findOne({
      where: { employee_id: id },
    });

    if (!findUser) {
      throw new NotFoundError('User not found');
    }

    const isActive = findUser.is_active ? false : true;

    const update = await this.userRes.update(
      { employee_id: id },
      { is_active: isActive },
    );

    return (update.affected as number) > 0
      ? `Change status to ${isActive ? 'active' : 'inactive'} successfully`
      : 'Change Status Failed';
  }
}
