import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PostRetweet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

//   @ManyToOne(() => UserPost)
//   @JoinColumn({ name: 'post_id' })
//   post: UserPost;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  retweeted_time: Date;
}
