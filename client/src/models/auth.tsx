export interface IUserRegister {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  error: string | null;
  loading: Boolean | null;
  user?: IUserRegister | null
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IResetParams {
  id: string | undefined;
  token: string | undefined;
}

export interface IConfirmReset {
  id: string | undefined;
  token: string | undefined;
  password: string;
  confirm_password: string;
}
