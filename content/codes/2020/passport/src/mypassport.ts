import { Request, Response, NextFunction } from "express"
import User from "./user"

declare global {
  namespace Express {
    interface User {}
    interface Request {
      user?: User
      logout: () => void
      isAuthenticated: () => boolean
    }
  }
}

const users: User[] = [new User(1, "user1", "pass01")]

class MyPassport {
  readonly key = "userId"

  initialize() {
    return (req: Request, res: Response, next: NextFunction) => {
      req.logout = () => {
        delete req.session![this.key]
      }

      next()
    }
  }

  // 세션에서 로그인 상태 복구
  session() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.session![this.key]) {
        const user = users.filter(u => u.id === req.session![this.key])[0]
        if (user) req.user = user
      }

      next()
    }
  }

  authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { username, password } = req.body
        const user = users.filter(u => u.identify(username, password))[0]

        if (!user) return res.sendStatus(401)

        req.session![this.key] = user.id
      } catch (err) {
        return next(err)
      }

      next()
    }
  }
}

export default new MyPassport()

export const isAuthenticated = () => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.sendStatus(403)

  next()
}
