import { Request, Response } from 'express'
import usersModel from './users.model'
import { UserDTO } from './dtos/users.dto'
import { validateUser } from './users.validations'

const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users: UserDTO[] = await usersModel.getAllUsers()
  res.json(users)
}

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { nombre, nickname, password, email } = validateUser(req.body)
  const result = await usersModel.createUser({ nombre, nickname, password, email })
  res.json({ result })
}

const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const result = await usersModel.getUserById(id)
  res.json({ result })
}

export default {
  getAllUsers,
  createUser,
  getUserById
}
