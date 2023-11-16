import { Column, PrimaryGeneratedColumn, Entity, BaseEntity, OneToMany, Like, ManyToMany } from 'typeorm';
import { LikedPost } from './LikedPost.entity.ts';
import { PostComment } from './PostComment.entity.ts';
import { PostRetweet } from './PostRetweet.entity.ts';


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

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'date', nullable: true })

  @Column({ nullable: true, type: 'bytea' })
  profilePhoto: Buffer | null;

  @OneToMany(() => LikedPost, (likedPost) => likedPost.user)
  likedPost: LikedPost[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComment: PostComment[];

  @OneToMany(() => PostRetweet, (postRetweet) => postRetweet.user)
  postRetweet: PostRetweet[];

  @ManyToMany (()=>User, (user)=>user.followers)
  followers:User[];

  @ManyToMany(()=>User,(user)=>user.following)
  following:User[]
}
