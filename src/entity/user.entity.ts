import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from './role.entity';
import { Branch } from './branch.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  employee_id: string; // use is for login is unique

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({ name: 'role_id' }) // optional: custom column name
  role: Role;

  @Column()
  role_id: number;

  @Column()
  name: string;

  @Column({ type: 'boolean', default: true })
  is_active?: boolean;

  @Column({ type: 'boolean', default: false })
  is_admin?: boolean;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @ManyToOne(() => Branch, (branch) => branch.users)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column()
  branch_id: number;
}
