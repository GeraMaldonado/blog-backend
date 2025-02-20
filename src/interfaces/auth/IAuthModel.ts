import { AuthDTO, UserAuthDTO } from '../../auth/dtos/auth.dto'

export interface IAuthModel {
  authenticateUser: (user: AuthDTO) => Promise<UserAuthDTO>
}
