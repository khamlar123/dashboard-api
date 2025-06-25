import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';
import { DepositType } from './deposit_type.entity';
import { DepositId } from './deposit_id.entity';

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 }) // ✅ Ensure correct type
  date: string;

  @ManyToOne(() => Branch, (branch) => branch.deposit)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ type: 'varchar', length: 10 })
  ccy: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cddbal: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cddballak: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cdcbal: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cdcballak: number;

  @ManyToOne(() => DepositId, (depositId) => depositId.deposit)
  @JoinColumn({ name: 'dep_id' })
  depositId: DepositId;

  @ManyToOne(() => DepositType, (type) => type.deposit)
  @JoinColumn({ name: 'dep_type_id' })
  depositType: DepositType;
}
