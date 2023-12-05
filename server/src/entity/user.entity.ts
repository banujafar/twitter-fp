import { Column, PrimaryGeneratedColumn, Entity, BaseEntity, OneToMany, Like, ManyToMany, JoinTable } from 'typeorm';
import { LikedPost } from './LikedPost.entity.ts';
import { PostComment } from './PostComment.entity.ts';
import { PostRetweet } from './PostRetweet.entity.ts';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  token: string | null;

  @Column({ nullable: true, type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ nullable: true, type: 'varchar', length: 30 })
  country: string;

  @Column({ nullable: true, type: 'varchar', length: 160 })
  bio: string;

  @Column({ nullable: true, type: 'varchar' })
  profilePhoto: string;

  @Column({ nullable: true, type: 'varchar' })
  headerPhoto: string;

  @OneToMany(() => LikedPost, (likedPost) => likedPost.user)
  likedPost: LikedPost[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComment: PostComment[];

  @OneToMany(() => PostRetweet, (postRetweet) => postRetweet.user)
  postRetweet: PostRetweet[];

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  following: User[];
}
