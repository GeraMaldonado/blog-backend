import { IPostModel } from '@/interfaces/posts/IPostModel'
import { Response, Request } from 'express'

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
    const { title, content, authorId, categoryId } = req.body
    const result = await this.postModel.createPost({ title, content, authorId, categoryId })
    res.status(201).json({ data: result })
  }

  updatePostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const updateData = req.body
    const result = await this.postModel.updatePostById(id, updateData)
    res.json({ data: result })
  }

  deletePostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const result = await this.postModel.deletePostById(id)
    res.json({ data: result })
  }
}
