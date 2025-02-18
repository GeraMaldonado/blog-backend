import { IUserAuth } from '../../interfaces/auth/IUserAuth'

export type UserAuthDTO = Pick<IUserAuth, 'email' | 'id' | 'username'>
export type AuthDTO = Pick<IUserAuth, 'email' | 'password'>
