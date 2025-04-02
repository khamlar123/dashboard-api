import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IncomeDaily {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branch: number;

  @Column()
  name: string;

  @Column()
  date: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  inc_plan: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  income: number;

  @Column()
  inc_code: string;

  @Column()
  inc_desc: string;
}
