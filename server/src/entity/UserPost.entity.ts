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

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP AT TIME ZONE \'UTC+4\''  })
  created_date: Date;
}
