export interface IUser {
    id: number,
    email: string,
    username: string,
    country?: string | null,
    isVerified: boolean,
    profilePhoto?: null,
    token?: string | null,
    followers?: IUser[] | null,
    following?: IUser[] | null
}

export interface IUserInitial {
    users: IUser[],
    error: string | null;
    loading: boolean | null;
}