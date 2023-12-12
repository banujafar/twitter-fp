import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './user.entity.ts';
import { UserPost } from './UserPost.entity.ts';

@Entity()
export class PostRetweet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserPost, {cascade: true})
  @JoinColumn({ name: 'mainPost_id' })
  mainPost: Relation<UserPost>;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => UserPost,  {cascade: true})
  @JoinColumn({ name: 'post_id' })
  post: Relation<UserPost>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  retweeted_time: Date;
}
