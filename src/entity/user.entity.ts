import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';
import { Sector } from './sector.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  employee_id: string; // use is for login is unique

  @Column()
  password: string;

  @Column()
  role: 'admin' | 'user';

  @Column()
  permissions: string; // use json  for check permission

  @Column()
  name: string;

  @Column({ type: 'boolean', default: true })
  is_active?: boolean;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;
}
