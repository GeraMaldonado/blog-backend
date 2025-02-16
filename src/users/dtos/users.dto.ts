import { IUser } from '../../interfaces/users/IUser'

export type CreateUserDTO = Pick<IUser, 'name' | 'username' | 'email' | 'password'>
export type UserDTO = Omit<IUser, 'password'>
export type UpdateUserDTO = Partial<CreateUserDTO>
