import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Sector } from './sector.entity';
import { Branch } from './branch.entity';

@Entity()
export class SectorBal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.sectorBal)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column() // ✅ Ensure correct type
  date: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  sec_balance: number;

  @ManyToOne(() => Sector, (sc) => sc.sectorBal)
  @JoinColumn({ name: 'sector_code' })
  sector: Sector;
}
