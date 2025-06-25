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
export class DepositType {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  dep_type_id: string;

  @Column({ type: 'varchar', length: 255 }) // ✅ Ensure correct type
  dep_type_desc: string;

  @OneToMany(() => Deposit, (d) => d.depositType)
  deposit: Deposit[];
}
