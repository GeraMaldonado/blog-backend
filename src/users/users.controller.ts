import { Request, Response } from 'express'
import usersModel from './users.model'

interface User {
  id: number
  username: string
}

const getAllUsers = (_req: Request, res: Response): void => {
  const users: User[] = usersModel.getAllUsers()
  res.json(users)
}

export default {
  getAllUsers
}
