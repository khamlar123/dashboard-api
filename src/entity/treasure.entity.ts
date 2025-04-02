import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Treasure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  amount: number;
}
