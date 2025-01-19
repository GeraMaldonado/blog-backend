export interface IUser {
  id: string
  nombre: string
  nickname: string
  email: string
  password: string
  fecha_creacion: Date
  posts?: string
  comentarios?: string
}

export type CreateUserDTO = Pick<IUser, 'nombre' | 'nickname' | 'email' | 'password'>
export type UserDTO = Omit<IUser, 'password'>
export type UpdateUserDTO = Partial<CreateUserDTO>
