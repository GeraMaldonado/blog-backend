import { IPostModel } from '@/interfaces/posts/IPostModel'
import { prisma } from '../model/database'
import { PostDTO, CreatePostDTO, UpdatePostDTO } from './dto/posts.dto'
import { randomUUID } from 'node:crypto'

export const PostModel: IPostModel = {

  async getAllPost (userid: string): Promise<PostDTO[]> {
    const allPost = await prisma.post.findMany({ where: userid ? { authorId: userid } : undefined })
    return allPost
  },

  async getPostById (id: string): Promise<PostDTO> {
    const postByID = await prisma.post.findUnique({ where: { id } })
    if (postByID == null) throw new Error('Post no encontrado')
    return postByID
  },

  async createPost (newPost: CreatePostDTO): Promise<string> {
    console.log(newPost)
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
