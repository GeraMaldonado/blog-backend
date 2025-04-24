import { Router } from 'express'
import { PostsController } from './posts.controller'
import { IPostModel } from '@/interfaces/posts/IPostModel'
//import { asyncHandler } from '../errors/asyncHandler'

export function createPostsRouter ({ postModel }: { postModel: IPostModel }): Router {
  const postsRouter = Router()

  const postsController = new PostsController({ postModel })

  postsRouter.get('/', postsController.getAllPosts) //asyncHandler(postsController.getAllPosts))
  postsRouter.get('/:id', postsController.getPostById) //asyncHandler(postsController.getPostById))
  postsRouter.post('/', postsController.createPost) //asyncHandler(postsController.createPost))
  postsRouter.patch('/:id', postsController.updatePostById) //asyncHandler(postsController.updatePostById))
  postsRouter.delete('/:id', postsController.deletePostById) //asyncHandler(postsController.deletePostById))

  return postsRouter
}
