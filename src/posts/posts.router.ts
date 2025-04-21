import { Router } from 'express'
import { PostsController } from './posts.controller'
import { IPostModel } from '@/interfaces/posts/IPostModel'

export function createPostsRouter ({ postModel }: { postModel: IPostModel }): Router {
  const postsRouter = Router()

  const postsController = new PostsController({ postModel })

  postsRouter.get('/', postsController.getAllPosts)
  postsRouter.get('/:id', postsController.getPostById)
  postsRouter.post('/', postsController.createPost)
  postsRouter.patch('/:id', postsController.updatePostById)
  postsRouter.delete('/:id', postsController.deletePostById)

  return postsRouter
}
