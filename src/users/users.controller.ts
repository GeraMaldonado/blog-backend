import { Request, Response } from 'express'
import usersModel from './users.model'
import { UserDTO } from './dtos/users.dto'
import { validateUser } from './users.validations'
import { ValidationError } from '../errors/customizedError'

const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users: UserDTO[] = await usersModel.getAllUsers()
  res.json(users)
}

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, nickname, password, email } = validateUser(req.body)
    const result = await usersModel.createUser({ nombre, nickname, password, email })
    res.json({ result })
  } catch (err: any) {
    if (err instanceof ValidationError) res.status(500).json({ type: err.name, message: err.message })
  }
}

export default {
  getAllUsers,
  createUser
}
