import { Request, Response, NextFunction } from 'express'
import { ForbiddenError, NotFoundError } from '../errors/customizedError'
import { prisma } from '../database/mysql'

export const protectRoutes = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.id !== req.params.id) return next(new ForbiddenError('You do not have permission to modify this resource'))
  next()
}

export const protectPostOwner = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const post = await prisma.post.findUnique({ where: { id: req.params.id } })
  if (!post) return next(new NotFoundError('post not found'))
  if (post.authorId !== req.user?.id) return next(new ForbiddenError('You do not have permission to modify this post'))

  next()
}
