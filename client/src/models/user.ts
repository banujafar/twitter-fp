export interface IUser {
    id: number,
    email: string,
    username: string,
    country?: string | null,
    isVerified: boolean,
    profilePhoto?: null,
    token?: string | null  
}