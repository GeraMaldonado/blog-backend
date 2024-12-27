import express from 'express'

const app = express()

app.set('port', 3000)

app.get('/ping', (_req, res) => {
  res.send('pong')
})

export default app
