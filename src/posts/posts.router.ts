import { Router } from 'express'
import { PostsController } from './posts.controller'
import { IPostModel } from '@/interfaces/posts/IPostModel'
import { asyncHandler } from '../errors/asyncHandler'

export function createPostsRouter ({ postModel }: { postModel: IPostModel }): Router {
  const postsRouter = Router()

  const postsController = new PostsController({ postModel })

  postsRouter.get('/', asyncHandler(postsController.getAllPosts))
  postsRouter.get('/:id', asyncHandler(postsController.getPostById))
  postsRouter.post('/', asyncHandler(postsController.createPost))
  postsRouter.patch('/:id', asyncHandler(postsController.updatePostById))
  postsRouter.delete('/:id', asyncHandler(postsController.deletePostById))

  return postsRouter
}
