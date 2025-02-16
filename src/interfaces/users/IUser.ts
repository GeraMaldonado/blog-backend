export interface IUser {
  id: string
  name: string
  username: string
  email: string
  password: string
  creation_date: Date
  posts?: string
  comments?: string
}
