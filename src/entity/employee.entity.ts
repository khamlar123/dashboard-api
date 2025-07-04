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
export class Employee {
  @PrimaryColumn() // Changed from @PrimaryGeneratedColumn()
  apb_sid: number; // This will be your manually assigned primary key

  @ManyToOne(() => Branch, (branch) => branch.employee)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column()
  sex: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  nationGroup: string;

  @Column({ nullable: true })
  pos_name: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  subjectStudy: string;

  @Column({ nullable: true })
  oldAreaEducation: string;
}
