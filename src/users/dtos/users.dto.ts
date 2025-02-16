import { IUser } from '../../interfaces/users/IUser'

export type CreateUserDTO = Pick<IUser, 'nombre' | 'nickname' | 'email' | 'password'>
export type UserDTO = Omit<IUser, 'password'>
export type UpdateUserDTO = Partial<CreateUserDTO>
