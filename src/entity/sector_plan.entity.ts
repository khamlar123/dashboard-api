import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';
import { Sector } from './sector.entity';

@Entity()
export class SectorPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.sectorPlan)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column() // ✅ Ensure correct type
  year: string;

  @ManyToOne(() => Sector, (sc) => sc.sectorPlan)
  @JoinColumn({ name: 'sector_id' })
  sector: Sector;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  sector_plan_amount: number;
}
