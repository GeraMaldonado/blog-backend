import { Router } from 'express'
import { PostsController } from './posts.controller'
import { IPostModel } from '../interfaces/posts/IPostModel'
import { asyncHandler } from '../errors/asyncHandler'
import { authMiddleware } from '../auth/auth.middleware'
import { protectPostOwner } from '../auth/protected.middleware'

export function createPostsRouter ({ postModel }: { postModel: IPostModel }): Router {
  const postsRouter = Router()

  const postsController = new PostsController({ postModel })

  postsRouter.get('/', asyncHandler(postsController.getAllPosts))
  postsRouter.get('/:id', asyncHandler(postsController.getPostById))
  postsRouter.post('/', authMiddleware, asyncHandler(postsController.createPost))
  postsRouter.patch('/:id', authMiddleware, protectPostOwner, asyncHandler(postsController.updatePostById))
  postsRouter.delete('/:id', authMiddleware, protectPostOwner, asyncHandler(postsController.deletePostById))

  return postsRouter
}
