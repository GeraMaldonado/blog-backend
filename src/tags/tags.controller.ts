import { Request, Response } from 'express'
import { TagsModel } from './tags.model'
import { validateTag } from './tags.validations'

export class TagsController {
  getAllTags = async (_req: Request, res: Response): Promise<void> => {
    const result = await TagsModel.getAllTags()
    res.json({ data: result })
  }

  createTag = async (req: Request, res: Response): Promise<void> => {
    const newTag = validateTag(req.body)
    const result = await TagsModel.createTag(newTag)
    res.status(201).json({ data: result })
  }
}
