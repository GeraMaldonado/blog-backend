import { Request, Response } from 'express'
import { UserDTO } from './dtos/users.dto'
import { validateUser, validatePartialUser, validateUserVerificationRequest } from './users.validations'
import { IUserModel } from '../interfaces/users/IUserModel'
import { requestVerificationCode, verifyCodeAndGetData } from '../services/userVerification.service'

export class UserController {
  private readonly userModel: IUserModel

  constructor ({ userModel }: { userModel: IUserModel }) {
    this.userModel = userModel
  }

  getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    const users: UserDTO[] = await this.userModel.getAllUsers()
    res.json({ data: users })
  }

  requestUserVerification = async (req: Request, res: Response): Promise<void> => {
    const { name, email } = validateUserVerificationRequest(req.body)
    await requestVerificationCode({ name, email })
    res.json({ message: 'Código de verificacion nviado al correo' })
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, username, password, email, code } = validateUser(req.body)
    verifyCodeAndGetData({ email, code })
    const result = await this.userModel.createUser({ name, username, password, email })
    res.status(201).json({ data: result })
  }

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const result = await this.userModel.getUserById(id)
    res.json({ data: result })
  }

  updateUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const updateData = validatePartialUser(req.body)
    const result = await this.userModel.updateUserById(id, updateData)
    res.json({ data: result })
  }

  deleteUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const deleteUser = await this.userModel.deleteUserById(id)
    res.json({ data: deleteUser })
  }
}
