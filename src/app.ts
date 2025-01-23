import express from 'express'
import { usersRouter } from './users/users.router'
import { errorHandler } from './middleware/errorHandler'
import { PORT } from './config'

const app = express()

app.use(express.json())

app.set('port', PORT)

app.use('/api', usersRouter)

app.use(errorHandler)

export default app
