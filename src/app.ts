import express from 'express'
import { usersRouter } from './users/users.router'

const app = express()

app.set('port', 3000)

app.use('/api', usersRouter)

export default app
