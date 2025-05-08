import { Router } from 'express'
import { PostsController } from './posts.controller'
import { IPostModel } from '../interfaces/posts/IPostModel'
import { asyncHandler } from '../errors/asyncHandler'
import { authMiddleware } from '../auth/auth.middleware'
import { protectRoutes } from '../auth/protected.middleware'

export function createPostsRouter ({ postModel }: { postModel: IPostModel }): Router {
  const postsRouter = Router()

  const postsController = new PostsController({ postModel })

  postsRouter.get('/', asyncHandler(postsController.getAllPosts))
  postsRouter.get('/:id', asyncHandler(postsController.getPostById))
  postsRouter.post('/', authMiddleware, protectRoutes, asyncHandler(postsController.createPost))
  postsRouter.patch('/:id', authMiddleware, protectRoutes, asyncHandler(postsController.updatePostById))
  postsRouter.delete('/:id', authMiddleware, protectRoutes, asyncHandler(postsController.deletePostById))

  return postsRouter
}
