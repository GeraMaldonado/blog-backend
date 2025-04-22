import { IPostModel } from '@/interfaces/posts/IPostModel'
import { Response, Request } from 'express'
import { validatePost, validatePartialPost } from './posts.validations'

export class PostsController {
  private readonly postModel: IPostModel

  constructor ({ postModel }: { postModel: IPostModel }) {
    this.postModel = postModel
  }

  getAllPosts = async (req: Request, res: Response): Promise<void> => {
    const { authorId } = req.query
    const result = await this.postModel.getAllPost(authorId as string)
    res.json({ data: result })
  }

  getPostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const result = await this.postModel.getPostById(id)
    res.json({ data: result })
  }

  createPost = async (req: Request, res: Response): Promise<void> => {
    const post = validatePost(req.body)
    const result = await this.postModel.createPost({
      ...post,
      content: post.content ?? null,
      categoryId: post.categoryId ?? null
    })
    res.status(201).json({ data: result })
  }

  updatePostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const updateData = validatePartialPost(req.body)
    const result = await this.postModel.updatePostById(id, updateData)
    res.json({ data: result })
  }

  deletePostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const result = await this.postModel.deletePostById(id)
    res.json({ data: result })
  }
}
