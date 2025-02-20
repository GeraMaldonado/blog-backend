import { createApp } from './app'
import { AuthModel } from './auth/auth.model'
import { UserModel } from './users/users.model'

const app = createApp({ userModel: UserModel, authModel: AuthModel })

const main = (): void => {
  app.listen(app.get('port'), (): void => {
    console.log(`Server on port: ${String(app.get('port'))}`)
  })
}

main()
