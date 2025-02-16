export interface IUser {
  id: string
  nombre: string
  nickname: string
  email: string
  password: string
  fecha_creacion: Date
  posts?: string
  comentarios?: string
}
