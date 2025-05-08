import { IPost } from '../../interfaces/posts/IPost'

export type PostDTO = IPost
export type CreatePostDTO = Pick<PostDTO, 'title' | 'content' | 'categoryId' | 'authorId'>
export type UpdatePostDTO = Partial<CreatePostDTO>
