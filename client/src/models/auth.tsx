export interface IUserRegister {
  username: string;
  email: string;
  user_id: number;
  profilePhoto?: string;
}

export interface AuthState {
  error: string | null;
  loading: Boolean | null;
  user?: IUserRegister | null;
  isAuth?: Boolean | null;
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

export interface IDecodedToken {
  exp: number;
  iat: number;
  userId: number | null;
  username: string | null;
}
