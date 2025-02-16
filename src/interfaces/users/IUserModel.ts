import { CreateUserDTO, UserDTO, UpdateUserDTO } from './dtos/users.dto'

export interface IUserModel {
  getAllUsers: () => Promise<UserDTO[]>
  getUserById: (id: string) => Promise<UserDTO | null>
  createUser: (newUser: CreateUserDTO) => Promise<string>
  updateUserById: (id: string, updateUser: UpdateUserDTO) => Promise<string>
  deleteUserById: (id: string) => Promise<string>
  validateUserExistance: (id: string) => Promise<void>
  validateUniqueFields: (user: UserDTO | UpdateUserDTO) => Promise<void>
}
