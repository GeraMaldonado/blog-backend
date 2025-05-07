import { createApp } from './app'
import { DB_TYPE } from './config'
import { AuthModel as PrismaAuthModel } from './auth/auth.model'
import { PostModel as PrismaPostModel } from './posts/posts.model'
import { UserModel as PrismaUserModel } from './users/users.model'

import { AuthModel as MongoAuthModel } from './auth/auth.model.mongo'
import { PostModel as MongoPostModel } from './posts/posts.model.mongo'
import { UserModel as MongoUserModel } from './users/users.model.mongo'

const app = createApp({
  userModel: DB_TYPE === 'mongo' ? MongoUserModel : PrismaUserModel,
  authModel: DB_TYPE === 'mongo' ? MongoAuthModel : PrismaAuthModel,
  postModel: DB_TYPE === 'mongo' ? MongoPostModel : PrismaPostModel
})

const main = (): void => {
  app.listen(app.get('port'), (): void => {
    console.log(`Server on port: ${String(app.get('port'))}`)
  })
}

main()
