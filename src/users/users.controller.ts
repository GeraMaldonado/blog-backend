import { Request, Response } from 'express'
import { UserDTO } from './dtos/users.dto'
import { validateUser, validatePatialUser } from './users.validations'
import { IUserModel } from '../interfaces/users/IUserModel'

export class UserController {
  private readonly userModel: IUserModel

  constructor ({ userModel }: { userModel: IUserModel }) {
    this.userModel = userModel
  }

  getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    const users: UserDTO[] = await this.userModel.getAllUsers()
    res.json(users)
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    const { nombre, nickname, password, email } = validateUser(req.body)
    const result = await this.userModel.createUser({ nombre, nickname, password, email })
    res.status(201).json({ result })
  }

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const result = await this.userModel.getUserById(id)
    res.json({ result })
  }

  updateUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const updateData = validatePatialUser(req.body)
    const result = await this.userModel.updateUserById(id, updateData)
    res.json({ result })
  }

  deleteUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const deleteUser = await this.userModel.deleteUserById(id)
    res.json({ deleteUser })
  }
}
