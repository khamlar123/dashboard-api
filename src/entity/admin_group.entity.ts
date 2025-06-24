import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AdminGroup {
  @PrimaryColumn() // Changed from @PrimaryGeneratedColumn()
  admin_group: string; // This will be your manually assigned primary key

  @Column()
  admin_group_desc: string;
}
