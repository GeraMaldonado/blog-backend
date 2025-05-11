import { CreatePostDTO, PostDTO, UpdatePostDTO } from '../../posts/dto/posts.dto'

export interface IPostModel {
  getAllPost: (userid: string) => Promise<PostDTO[]>
  getPostById: (id: string) => Promise<PostDTO | null>
  createPost: (newPost: CreatePostDTO) => Promise<string>
  updatePostById: (id: string, updateUser: UpdatePostDTO) => Promise<string>
  deletePostById: (id: string) => Promise<string>
  validatePostExist: (id: string) => Promise<void>
}
