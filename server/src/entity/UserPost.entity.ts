import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation, CreateDateColumn } from 'typeorm';
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

  @Column('simple-array', { nullable: true }) 
  img: string[];

  @CreateDateColumn()
  created_date: Date;
}
