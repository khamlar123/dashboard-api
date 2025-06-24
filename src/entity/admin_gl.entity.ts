import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AdminGl {
  @PrimaryColumn()
  admin_gl: string;

  @Column()
  gl_desc: string;

  @Column()
  sub_group: string;
}
