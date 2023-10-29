export interface IUserRegister {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  error: string | null;
  user: IUserRegister | null;
}
