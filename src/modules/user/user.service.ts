import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, RoleType } from '../../dto/create-user.dto';
import { genHash } from '../../share/functions/hash-unity';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRes: Repository<User>,
  ) {}

  async findAll(): Promise<any> {
    try {
      return await this.userRes.find();
    } catch (e) {
      return e.message;
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      return await this.userRes.findOne({
        where: {
          employee_id: id,
        },
      });
    } catch (e) {
      return e.message;
    }
  }

  // async create(dto: CreateUserDto): Promise<any> {
  //   const hasPassword = await genHash(dto.password);
  //   const model = {
  //     employee_id: dto.employee_id,
  //     password: hasPassword,
  //     role: dto.role,
  //     permissions: dto.permissions,
  //     name: dto.name,
  //     phone: dto.phone,
  //     email: dto.email,
  //     is_active: true,
  //   };
  //
  //   try {
  //     return await this.userRes.save(model);
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
  //
  // async update(id: string, dto: UpdateUserDto): Promise<any> {
  //   if (dto.password) {
  //     dto.password = await genHash(dto.password);
  //   }
  //   try {
  //     const updated = await this.userRes.update({ employee_id: id }, dto);
  //     return (updated.affected ?? 0) > 0 ? id : 0;
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }
  // }

  async toggleStatus(id: string): Promise<any> {
    const findUser = await this.userRes.findOne({
      where: { employee_id: id },
    });

    if (!findUser) {
      throw new NotFoundError('User not found');
    }

    const isActive = findUser.is_active ? false : true;

    return await this.userRes.update(
      { employee_id: id },
      { is_active: isActive },
    );
  }
}
