import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PlAllDaily {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branch: number;

  @Column()
  name: string;

  @Column()
  date: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  plan_branch: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  amount: number;
}
