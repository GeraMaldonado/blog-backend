import express, { Application } from 'express'
import { createUserRouter } from './users/users.router'
import { createAuthRouter } from './auth/auth.router'
import { errorHandler } from './errors/errorHandler'
import { PORT } from './config'
import { IUserModel } from './interfaces/users/IUserModel'
import cookieParser from 'cookie-parser'
import { IAuthModel } from './interfaces/auth/IAuthModel'

export const createApp = ({ userModel, authModel }: { userModel: IUserModel, authModel: IAuthModel }): Application => {
  const app = express()

  app.set('port', PORT)

  app.use(express.json())

  app.use(cookieParser())

  app.use('/api/users', createUserRouter({ userModel }))

  app.use('/api/auth', createAuthRouter({ authModel }))

  app.use(errorHandler)

  return app
}
