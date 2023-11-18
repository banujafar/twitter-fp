import { IUser } from './user';

export interface IUserPost {
  id: number;
  user: IUser;
  content?: string | null;
  img?: File | null;
  created_date: Date;
}

export interface IPostInitialState {
  post: IUserPost[] | null;
  error: string | null;
  loading: boolean | null;
}
