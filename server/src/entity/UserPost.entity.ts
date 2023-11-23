import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity.ts';
import { PostRetweet } from './PostRetweet.entity.ts';
import { LikedPost } from './LikedPost.entity.ts';

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

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @OneToMany(() => LikedPost, (likedPost) => likedPost.post,  { cascade: true })
  likes: LikedPost[];
}
