import { encryptCompare } from '../utils'
import { NotFoundError, UnauthorizedError } from '../errors/customizedError'
import { AuthDTO, UserAuthDTO } from './dtos/auth.dto'
import { IAuthModel } from '../interfaces/auth/IAuthModel'
import { connectToMongo } from '../database/mongodb'
import { UserMongo, type UserEntity } from '../users/users.model.mongo'

export const AuthModel: IAuthModel = {
  async authenticateUser({ email, password }: AuthDTO): Promise<UserAuthDTO> {
    await connectToMongo()

    const user = await UserMongo.findOne({ email }).lean<UserEntity>()

    if (!user) throw new NotFoundError('Invalid email or password')

    const isPasswordValid = await encryptCompare(password, user.password)
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password')

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    }
  }
}
