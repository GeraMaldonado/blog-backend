import { Router } from 'express'
import { createUserRouter } from '../users/users.router'
import { createAuthRouter } from '../auth/auth.router'
import { IUserModel } from '../interfaces/users/IUserModel'
import { IAuthModel } from '../interfaces/auth/IAuthModel'
import { createPostsRouter } from '../posts/posts.router'
import { IPostModel } from '@/interfaces/posts/IPostModel'

export function createRouter ({ userModel, authModel, postModel }: { userModel: IUserModel, authModel: IAuthModel, postModel: IPostModel }): Router {
  const router = Router()
  router.use('/users', createUserRouter({ userModel }))
  router.use('/auth', createAuthRouter({ authModel }))
  router.use('/posts', createPostsRouter({ postModel }))

  return router
}
