import { Column, PrimaryGeneratedColumn, Entity, BaseEntity, OneToMany, Like } from 'typeorm';
import { LikedPost } from './LikedPost.entity';
import { PostComment } from './PostComment.entity';
import { PostRetweet } from './PostRetweet.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token: string | null;

  @Column({ nullable: true, type: 'boolean', default: false })
  isVerified: boolean;

  @Column()
  country: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true, type: 'bytea' })
  profilePhoto: Buffer | null;

  @OneToMany(() => LikedPost, (likedPost) => likedPost.user)
  likedPost: LikedPost[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComment: PostComment[];

  @OneToMany(() => PostRetweet, (postRetweet) => postRetweet.user)
  postRetweet: PostRetweet[];
}
