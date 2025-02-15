import express, { Application } from 'express'
import { createUserRouter } from './users/users.router'
import { errorHandler } from './errors/errorHandler'
import { PORT } from './config'
import { IUserModel } from './users/IUserModel'

export const createApp = ({ userModel }: { userModel: IUserModel }): Application => {
  const app = express()

  app.set('port', PORT)

  app.use(express.json())

  app.use('/api/users', createUserRouter({ userModel }))

  app.use(errorHandler)

  return app
}
