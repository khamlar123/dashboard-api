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
import { Deposit } from './deposit.entity';

@Entity()
export class DepositId {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  dep_id: string;

  @Column({ type: 'varchar', length: 255 }) // ✅ Ensure correct type
  dep_desc: string;

  @OneToMany(() => Deposit, (d) => d.depositId)
  deposit: Deposit[];
}
