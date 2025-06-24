import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AdminGroup } from './admin_group.entity';

@Entity()
export class AdminSubGroup {
  @PrimaryColumn() // Changed from @PrimaryGeneratedColumn()
  sub_group: string; // This will be your manually assigned primary key

  @Column()
  sub_group_desc: string;

  @Column()
  admin_group: string;
}
