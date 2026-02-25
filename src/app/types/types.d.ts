import { IUserRequest } from "../interfaces/IUserRequest"

declare global {
  namespace Express {
    interface Request {
      user?: IUserRequest
    }
  }
}
