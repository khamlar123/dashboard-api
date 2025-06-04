import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IncomeCode } from './income_code.entity';
import { Branch } from './branch.entity';

@Entity()
export class ProfitPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.profitPlan)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column() // ✅ Ensure correct type
  year: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  amount: number;
}
