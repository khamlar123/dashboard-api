import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'boolean', default: true })
  is_active?: boolean;

  @OneToMany(() => User, (user) => user.role)
  user: User[];

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
