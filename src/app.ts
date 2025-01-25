import express from 'express'
import { createUserRouter } from './users/users.router'
import { errorHandler } from './middleware/errorHandler'
import { PORT } from './config'
import { UserModel } from './users/users.model'

const app = express()

app.use(express.json())

app.set('port', PORT)

app.use('/api', createUserRouter({ userModel: UserModel }))

app.use(errorHandler)

export default app
