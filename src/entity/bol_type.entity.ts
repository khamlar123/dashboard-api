import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BolLoan } from './bol_loan.entity';
import { Capital } from './capital.entity';

@Entity()
export class BolType {
  @PrimaryColumn() // Changed from @PrimaryGeneratedColumn()
  bol_type: string; // This will be your manually assigned primary key

  @Column()
  bol_desc: string;

  @OneToMany(() => BolLoan, (b) => b.capitalType)
  bolLoan: Capital[];
}
