import express from 'express'
import { usersRouter } from './users/users.router'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(express.json())

app.set('port', 3000)

app.use('/api', usersRouter)

app.use(errorHandler)

export default app
