import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity.ts';
import { UserPost } from './UserPost.entity.ts';

@Entity()
export class Notifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  user: Relation<User>;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: Relation<User>;

  @ManyToOne(() => UserPost, { nullable: true })
  @JoinColumn({ name: 'post_id' })
  post: Relation<UserPost>;

  @Column('varchar', { nullable: true })
  type: string | null;

  @Column('boolean', { default: false })
  read: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;
}
