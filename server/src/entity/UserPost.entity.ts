import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation, OneToMany } from 'typeorm';
import { User } from './user.entity.ts';

@Entity()
export class UserPost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
  
  @Column('varchar', { length: 280 })
  content: string | null;

  @Column('text', { array: true, nullable: true })
  img: Buffer[] | null;;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_time: Date;
}
