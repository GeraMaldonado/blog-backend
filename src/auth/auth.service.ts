import jwt, { Secret } from 'jsonwebtoken'
import { SECRET_JWT_KEY, SECRET_REFRESH_JWT_KEY } from '../config'

export const generateAccessToken = async (user: any): Promise<string> => {
  return jwt.sign(
    { id: user.id, username: user.nickname },
    SECRET_JWT_KEY as Secret,
    { expiresIn: '15m' }
  )
}

export const generateRefreshToken = async (user: any): Promise<string> => {
  return jwt.sign(
    { id: user.id },
    SECRET_REFRESH_JWT_KEY as Secret,
    { expiresIn: '7d' }
  )
}

export const verifyToken = async (token: string): Promise<any> => {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_JWT_KEY as Secret, (err, decoded) => {
      if (err != null) return reject(err)
      resolve(decoded)
    })
  })
}
