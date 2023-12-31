export interface IUser {
  id: number;
  email: string;
  username: string;
  country?: string | null;
  isVerified: boolean;
  profilePhoto?: null;
  headerPhoto?: null;
  bio?: string | null;
  token?: string | null;
  followers: IUser[] | null;
  following: IUser[] | null;
  notifications: IUser[] | null;
}

export interface IUserInitial {
  users: IUser[];
  error: string | null;
  loading: boolean | null;
  isNotified: boolean | undefined;
}
