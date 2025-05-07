import { randomUUID } from 'node:crypto'
import { prisma } from '../database/mysql'

interface CommentDTO {
  id: string
  content: string
  createdAt: Date
  authorId: string
  postId: string
}

interface CreateCommentDTO {
  content: string
  authorId: string
  postId: string
}

export const CommentsModel = {
  async getAllComments (filters: { username?: string, postId?: string }): Promise<CommentDTO[]> {
    const comments = await prisma.comment.findMany({
      where: {
        ...(filters.postId ? { postId: filters.postId } : {}),
        ...(filters.username ? { author: { username: filters.username } } : {})
      },
      include: {
        author: true,
        post: true
      }
    })

    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      authorId: comment.authorId,
      postId: comment.postId
    }))
  },

  async createComment (newComment: CreateCommentDTO): Promise<string> {
    const id = randomUUID()
    await prisma.comment.create({
      data: {
        id,
        ...newComment
      }
    })
    return id
  }
}
