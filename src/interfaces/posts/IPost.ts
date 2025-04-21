export interface IPost {
  id: string
  title: string
  content: string | null
  publishedAt: Date
  authorId: string
  categoryId?: string | null
}
