export interface IUserPost {
  id: number;
  user_id: number;
  content?: string | null;
  img?: string | null;
  created_date: Date;
}

export interface IPostInitialState {
  post: IUserPost[] | null;
  error: string | null;
  loading: boolean | null;
}
