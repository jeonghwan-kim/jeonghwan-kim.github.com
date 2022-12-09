import passport from "passport"
import { Strategy } from "passport-local"
import User from "./user"
import { Request, Response, NextFunction } from "express"

declare global {
  namespace Express {
    interface Request {
      _passport: {}
    }
  }
}

const users: User[] = [new User(1, "user1", "pass01")]

passport.serializeUser(function aaa(user: User, cb) {
  cb(null, user.id)
})

passport.deserializeUser((userId: number, cb) => {
  const user = users.filter(u => u.id === userId)[0]
  cb(null, user)
})

passport.use(
  new Strategy({ session: true }, (username, password, done) => {
    try {
      const user = users.filter(u => u.identify(username, password))[0]
      done(null, user ? user : false)
    } catch (err) {
      done(err)
    }
  })
)

export default passport

export const isAuthenticated = () => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.sendStatus(403)

  next()
}
