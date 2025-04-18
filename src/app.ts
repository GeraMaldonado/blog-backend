import express, { Application } from 'express'
import { errorHandler } from './errors/errorHandler'
import { PORT } from './config'
import { IUserModel } from './interfaces/users/IUserModel'
import cookieParser from 'cookie-parser'
import { IAuthModel } from './interfaces/auth/IAuthModel'
import cors from 'cors'
import { createRouter } from './router/router'

export const createApp = ({ userModel, authModel }: { userModel: IUserModel, authModel: IAuthModel }): Application => {
  const app = express()

  app.set('port', PORT)

  app.use(cors({ origin: 'http://localhost:5173', credentials: true, optionsSuccessStatus: 200 }))
  app.use(express.json())

  app.use(cookieParser())

  app.use('/api', createRouter({ userModel, authModel }))

  app.use(errorHandler)

  return app
}
