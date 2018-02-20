export interface IUser {
    email: string,
    password?: string,
    userName: string,
    lastLoginDate: Date,
    categories: string[]
}