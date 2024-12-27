import app from './app'

const main = (): void => {
  app.listen(app.get('port'), (): void => {
    console.log(`Server on port: ${String(app.get('port'))}`)
  })
}

main()
