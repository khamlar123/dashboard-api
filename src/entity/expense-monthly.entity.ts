import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExpenseMonthly {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branch: number;

  @Column()
  name: string;

  @Column()
  date: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  exp_plan: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  expense: number;

  @Column()
  exp_code: string;

  @Column()
  exp_desc: string;
}
