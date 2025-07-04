import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';

@Entity()
export class EmployeeLeft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // Changed from @PrimaryGeneratedColumn()
  apb_sid: number; // This will be your manually assigned primary key

  @Column()
  sex: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  pos_name: string;

  @Column({ nullable: true })
  department_branch: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  document_date: string;
}
