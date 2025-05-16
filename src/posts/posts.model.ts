import { IPostModel } from '../interfaces/posts/IPostModel'
import { prisma } from '../database/mysql'
import { PostDTO, CreatePostDTO, UpdatePostDTO, PopulatedPostDTO } from './dto/posts.dto'
import { randomUUID } from 'node:crypto'
import { NotFoundError } from '../errors/customizedError'

export const PostModel: IPostModel = {

  async validatePostExist (id): Promise<void> {
    if (await prisma.post.findUnique({ where: { id } }) == null) throw new NotFoundError('post not found')
  },

  async getAllPost (userid: string): Promise<PopulatedPostDTO[]> {
    const allPost = await prisma.post.findMany({
      where: userid ? { authorId: userid } : undefined,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    return allPost
  },

  async getPostById (id: string): Promise<PostDTO> {
    await this.validatePostExist(id)
    const postByID = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, username: true } },
        category: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } }
      }
    })
    if (postByID == null) throw new Error('Post no encontrado')
    return postByID
  },

  async createPost (newPost: CreatePostDTO): Promise<string> {
    const id: string = randomUUID()
    await prisma.post.create({
      data: {
        id,
        title: newPost.title,
        authorId: newPost.authorId,
        content: newPost.content ?? null,
        categoryId: newPost.categoryId ?? null
      }
    })
    return id
  },

  async updatePostById (id: string, updatePost: UpdatePostDTO): Promise<string> {
    await prisma.post.update({
      where: { id },
      data: updatePost
    })
    return `Post ${id} updated`
  },

  async deletePostById (id: string): Promise<string> {
    await prisma.post.delete({ where: { id } })
    return `Post ${id} deleted`
  }
}
