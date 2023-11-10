import { Column, PrimaryGeneratedColumn, Entity, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token: string | null; 

  @Column({ nullable: true, type: 'boolean', default: false })
  isVerified: boolean;
}
