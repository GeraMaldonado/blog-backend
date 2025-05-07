import { Request, Response } from 'express'
import { CommentsModel } from './comments.model'
import { validateCreateComment, validateCommentQuery } from './comments.validations'

export class CommentsController {
  private readonly commentsModel = CommentsModel

  getAllComments = async (req: Request, res: Response): Promise<void> => {
    const filters = validateCommentQuery(req.query)
    const result = await this.commentsModel.getAllComments(filters)
    res.json({ data: result })
  }

  createComment = async (req: Request, res: Response): Promise<void> => {
    const newComment = validateCreateComment(req.body)
    const result = await this.commentsModel.createComment(newComment)
    res.status(201).json({ data: result })
  }
}
