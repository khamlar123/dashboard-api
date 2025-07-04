import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EmployeeNew {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sex: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  pos_name: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  reason: string;
}
