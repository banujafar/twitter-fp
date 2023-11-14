import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './user.entity.ts';
import { UserPost } from './UserPost.entity.ts';

@Entity()
export class PostRetweet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserPost)
  @JoinColumn({ name: 'post_id' })
  post: Relation<UserPost>;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  retweeted_time: Date;
}
