import { prisma } from '../database/mysql'
import { encryptCompare } from '../utils'
import { NotFoundError, UnauthorizedError } from '../errors/customizedError'
import { AuthDTO, UserAuthDTO } from './dtos/auth.dto'
import { IAuthModel } from '../interfaces/auth/IAuthModel'

export const AuthModel: IAuthModel = {
  async authenticateUser ({ email, password }: AuthDTO): Promise<UserAuthDTO> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user == null) throw new NotFoundError('Invalid email or password')
    const isPasswordValid = await encryptCompare(password, user.password)
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password')
    return { id: user.id, username: user.username, email: user.email }
  }
}
