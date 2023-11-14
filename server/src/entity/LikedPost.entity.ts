import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './user.entity.ts';

@Entity()
export class LikedPost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

//   @ManyToOne(() => UserPost)
//   @JoinColumn({ name: 'post_id' })
//   post: UserPost;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  liked_time: Date;
}
