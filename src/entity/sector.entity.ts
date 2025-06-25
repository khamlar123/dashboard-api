import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SectorPlan } from './sector_plan.entity';
import { SectorBal } from './sector_bal.entity';

@Entity()
export class Sector {
  @PrimaryColumn()
  sector_code: string;

  @Column()
  description: string;

  @OneToMany(() => SectorPlan, (sp) => sp.sector)
  sectorPlan: SectorPlan[];

  @OneToMany(() => SectorBal, (sp) => sp.sector)
  sectorBal: SectorBal[];
}
