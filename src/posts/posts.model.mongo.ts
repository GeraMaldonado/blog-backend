import mongoose from 'mongoose'
import { IPostModel } from '../interfaces/posts/IPostModel'
import { PostDTO, CreatePostDTO, UpdatePostDTO } from './dto/posts.dto'
import { connectToMongo } from '../database/mongodb'

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: null },
  publishedAt: { type: Date, default: Date.now },
  authorId: { type: String, required: true },
  categoryId: { type: String, default: null }
})

type PostEntity = {
  _id: mongoose.Types.ObjectId
  title: string
  content?: string | null
  publishedAt: Date
  authorId: string
  categoryId?: string | null
}

const PostMongo = mongoose.models.Post || mongoose.model('Post', postSchema)

export const PostModel: IPostModel = {
  async getAllPost(userid?: string): Promise<PostDTO[]> {
    await connectToMongo()
    const posts = await PostMongo.find(userid ? { authorId: userid } : {}).lean<PostEntity[]>()
    return posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content ?? null,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      categoryId: post.categoryId ?? undefined
    }))
  },

  async getPostById(id: string): Promise<PostDTO> {
    await connectToMongo()
    const post = await PostMongo.findById(id).lean<PostEntity>()
    if (!post) throw new Error('Post no encontrado')
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content ?? null,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      categoryId: post.categoryId ?? undefined
    }
  },

  async createPost(newPost: CreatePostDTO): Promise<string> {
    await connectToMongo()
    const post = await PostMongo.create({
      title: newPost.title,
      content: newPost.content ?? null,
      authorId: newPost.authorId,
      categoryId: newPost.categoryId ?? null
    })
    return post._id.toString()
  },

  async updatePostById(id: string, updatePost: UpdatePostDTO): Promise<string> {
    await connectToMongo()
    const post = await PostMongo.findByIdAndUpdate(id, updatePost, { new: true })
    if (!post) throw new Error('Post no encontrado')
    return `Post ${post._id.toString()} updated`
  },

  async deletePostById(id: string): Promise<string> {
    await connectToMongo()
    const post = await PostMongo.findByIdAndDelete(id)
    if (!post) throw new Error('Post no encontrado')
    return `Post ${post._id.toString()} deleted`
  }
}
