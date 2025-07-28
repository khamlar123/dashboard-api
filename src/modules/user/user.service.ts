import {
  BadRequestException,
  ConflictException,
  Injectable,
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
    create.permissions = await this.permissionRes.findByIds(dto.rolesIds);

    return await this.roleRes.save(create);
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

  async findAll(): Promise<any> {
    try {
      return await this.userRes.find({
        relations: ['role', 'role.permissions'],
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
      role_id: dto.role_id,
      branch_id: dto.branch_id, // or dto.branch if that's ID
    });

    try {
      return await this.userRes.save(model);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
