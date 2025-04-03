import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { IncomePlan } from './income_plan.entity';
import { Income } from './income.entity';

@Entity()
export class IncomeCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;

  @OneToMany(() => IncomePlan, (incomePlan) => incomePlan.income_code)
  incomePlans: IncomePlan[];

  @OneToMany(() => Income, (income) => income.income_code)
  income: Income[];
}
