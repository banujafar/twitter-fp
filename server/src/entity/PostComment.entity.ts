import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PostComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

//   @ManyToOne(() => UserPost)
//   @JoinColumn({ name: 'post_id' })
//   post: UserPost;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text')
  comment_text: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_time: Date;
}
