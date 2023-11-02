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

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IResetParams {
  id: string | undefined;
  token: string | undefined;
}
