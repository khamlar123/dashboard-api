import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InExProYear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: string;

  @Column()
  branch: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  plan_income: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  income: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  plan_expenses: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  expense: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  plan_profit: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  profit: number;
}
