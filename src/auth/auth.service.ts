import jwt, { Secret } from 'jsonwebtoken'
import { SECRET_JWT_KEY, SECRET_REFRESH_JWT_KEY } from '../config'
import { UserAuthDTO } from './dtos/auth.dto'

export const generateAccessToken = async (user: UserAuthDTO): Promise<string> => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    SECRET_JWT_KEY as Secret,
    { expiresIn: '15m' }
  )
}

export const generateRefreshToken = async (user: UserAuthDTO): Promise<string> => {
  return jwt.sign(
    { id: user.id },
    SECRET_REFRESH_JWT_KEY as Secret,
    { expiresIn: '7d' }
  )
}

export const verifyRefreshToken = async (token: string): Promise<any> => {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_REFRESH_JWT_KEY as Secret, (err, decoded) => {
      if (err != null) return reject(err)
      resolve(decoded)
    })
  })
}

export const verifyToken = async (token: string): Promise<any> => {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_JWT_KEY as Secret, (err, decoded) => {
      if (err != null) return reject(err)
      resolve(decoded)
    })
  })
}
