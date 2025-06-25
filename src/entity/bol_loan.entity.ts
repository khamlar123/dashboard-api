import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';
import { BolType } from './bol_type.entity';

@Entity()
export class BolLoan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10 })
  date: string;

  @ManyToOne(() => Branch, (branch) => branch.bolLoan)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => BolType, (b) => b.bolLoan)
  @JoinColumn({ name: 'bol_type' })
  capitalType: BolType;
}
