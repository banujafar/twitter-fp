import { IUser } from './user';

export interface ILike {
  id: number;
  user: IUser;
  post: IUserPost;
  liked_time: Date;
}
// TODO: it should be fixed, comment returns:
// {
//   "id": 39,
//   "comment": "test",
//   "postId": 245,
//   "userId": 151
// }
export interface IComment {
  id: number;
  comment?: string;
  userId: number;
  postId: number;
}

export interface IUserPost {
  id: number;
  user: IUser;
  content?: string | null;
  img?: File | null;
  created_date: Date;
  retweets?: IUserPost[] | null;
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
