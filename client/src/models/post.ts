import { IUser } from './user';

export interface ILike {
  id: number;
  user: IUser;
  post: IUserPost;
  liked_time: Date;
}
export interface IComment {
  id: number;
  user: IUser;
  comment_text: string;
  post: IUserPost;
  created_time: Date;
}

export interface IUserPost {
  id: number;
  user: IUser;
  content?: string | null;
  img?: File | null;
  created_date: Date;
  retweets?: IUserPost[] | null;
  retweetFrom?: any; //TODO
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
