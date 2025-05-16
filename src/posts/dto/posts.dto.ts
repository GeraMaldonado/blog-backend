import { IPost } from '../../interfaces/posts/IPost'

export type PostDTO = IPost
export type CreatePostDTO = Pick<PostDTO, 'title' | 'content' | 'categoryId' | 'authorId'>
export type UpdatePostDTO = Partial<CreatePostDTO>

export type PopulatedPostDTO = {
  id: string
  title: string
  content: string | null
  publishedAt: Date
  author: {
    id: string
    name: string
    username: string
  }
  category: {
    id: string
    name: string
  } | null
  tags: {
    id: string
    name: string
  }[]
}