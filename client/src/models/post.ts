import { IUser } from './user';

export interface ILike {
  id: number;
  user: IUser;
  post: IUserPost;
  liked_time: Date;
}
export interface IComment {
  id: number;
  comment: string;
  user: IUser;
  post: IUserPost;
  created_time: Date;
}

export interface IUserPost {
  id: number;
  user: IUser;
  content?: string | null;
  img?: File | null;
  created_date: Date;
  retweeted: IUserPost | null;
  retweets: IUserPost[] | null;
  likes: ILike[];
  comments: IComment[];
}

export interface IPostInitialState {
  post: IUserPost[];
  error: string | null;
  loading: boolean | null;
}

export interface ILikeInitialState {
  likes: ILike[];
  error: string | null;
  loading: boolean | null;
}

export interface IAddRetweet {
  userId: number;
  rtwId: number;
}

export interface INotifications {
  postId: number;
  senderName: string;
  type: string;
  read: boolean;
}

export interface INotificationsState {
  notifications: INotifications[];
  error: string | null;
  loading: boolean;
}
