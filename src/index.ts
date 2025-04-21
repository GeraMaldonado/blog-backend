import { createApp } from './app'
import { AuthModel } from './auth/auth.model'
import { PostModel } from './posts/posts.model'
import { UserModel } from './users/users.model'

const app = createApp({ userModel: UserModel, authModel: AuthModel, postModel: PostModel })

const main = (): void => {
  app.listen(app.get('port'), (): void => {
    console.log(`Server on port: ${String(app.get('port'))}`)
  })
}

main()
