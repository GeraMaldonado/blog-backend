import mongoose from 'mongoose'
import { IUserModel } from '../interfaces/users/IUserModel'
import { UserDTO, CreateUserDTO } from '../users/dtos/users.dto'
import { NotFoundError } from '../errors/customizedError'
import { MONGO_URI } from '../config'

// Tipo que representa un usuario en la base de datos
type UserEntity = {
  _id: mongoose.Types.ObjectId
  name: string
  username: string
  email: string
  password: string
  creation_date: Date
}

// Función para conectar a Mongo
const connectToMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URI, { authSource: 'admin' })
  }
}

// Definición del esquema y modelo
const userSchema = new mongoose.Schema<UserEntity>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creation_date: { type: Date, default: Date.now }
})

const UserMongo = mongoose.models.User || mongoose.model<UserEntity>('User', userSchema)

// Implementación del modelo
export const UserModel: IUserModel = {
  async getAllUsers(): Promise<UserDTO[]> {
    await connectToMongo()
    const users = await UserMongo.find().lean() as unknown as UserEntity[]
    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      creation_date: user.creation_date
    }))
  },

  async getUserById(id: string): Promise<UserDTO> {
    await connectToMongo()
    const user = await UserMongo.findById(id).lean() as unknown as UserEntity
    if (!user) throw new NotFoundError('user not found')
    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      creation_date: user.creation_date
    }
  },

  // 🔥 ESTE FALTABA:
  async createUser(newUser: CreateUserDTO): Promise<string> {
    await connectToMongo()
    const user = await UserMongo.create(newUser)
    return user._id.toString()
  },

  async updateUserById(id: string, updatedUser: Partial<CreateUserDTO>): Promise<string> {
    await connectToMongo()
    const user = await UserMongo.findByIdAndUpdate(id, updatedUser, { new: true, lean: true }) as unknown as UserEntity
    if (!user) throw new NotFoundError('user not found')
    return `User ${user._id.toString()} updated`
  },

  async deleteUserById(id: string): Promise<string> {
    await connectToMongo()
    const user = await UserMongo.findByIdAndDelete(id).lean() as unknown as UserEntity
    if (!user) throw new NotFoundError('user not found')
    return `User ${user._id.toString()} deleted`
  },

  async validateUserExistance(id: string): Promise<void> {
    await connectToMongo()
    const user = await UserMongo.findById(id)
    if (!user) throw new NotFoundError('user not found')
  },

  async validateUniqueFields(user: Partial<CreateUserDTO>): Promise<void> {
    await connectToMongo()
    const existingUser = await UserMongo.findOne({
      $or: [{ username: user.username }, { email: user.email }]
    })

    if (existingUser) {
      if (existingUser.username === user.username) {
        throw new Error('Username already in use')
      }
      if (existingUser.email === user.email) {
        throw new Error('Email already in use')
      }
    }
  }
}
