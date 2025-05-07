import { randomUUID } from 'node:crypto'
import { prisma } from '../database/mysql'

export interface Tag {
  id: string
  name: string
}

export const TagsModel = {
  async getAllTags (): Promise<Tag[]> {
    const tags = await prisma.tag.findMany()
    return tags
  },

  async createTag (newTag: { name: string }): Promise<string> {
    const id = randomUUID()
    await prisma.tag.create({ data: { id, name: newTag.name } })
    return id
  }
}
