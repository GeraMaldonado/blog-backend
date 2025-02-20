import { Request, Response } from 'express'
import { validateUserAuth } from './auth.validations'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './auth.service'
import { UnauthorizedError } from '../errors/customizedError'
import { UserAuthDTO } from './dtos/auth.dto'
import { IAuthModel } from '../interfaces/auth/IAuthModel'

export class AuthController {
  private readonly authModel: IAuthModel

  constructor ({ authModel }: { authModel: IAuthModel }) {
    this.authModel = authModel
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = validateUserAuth(req.body)
    const userAuth: UserAuthDTO = await this.authModel.authenticateUser({ email, password })
    if (!userAuth) throw new UnauthorizedError('Invalid email or password')

    const accessToken = await generateAccessToken(userAuth)
    const refreshToken = await generateRefreshToken(userAuth)

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.status(200).json({ message: 'Login successful' })
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refresh_token
    if (!refreshToken) throw new UnauthorizedError('Refresh token not provided')

    const decoded = await verifyRefreshToken(refreshToken)

    const newAccessToken = await generateAccessToken(decoded)
    const newRefreshToken = await generateRefreshToken(decoded)

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    })

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.status(200).json({ message: 'Token refreshed successfully' })
  }

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.status(200).json({ message: 'Logout successful' })
  }
}
