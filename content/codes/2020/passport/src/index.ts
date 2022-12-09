import express, {
  Request,
  Response,
  NextFunction,
  urlencoded,
  json,
} from "express"
import session from "express-session"
import path from "path"
// import mypassport, { isAuthenticated } from './mypassport';
import passport, { isAuthenticated } from "./passport"

const app = express()

app.use(
  session({
    secret: "qwer1234",
    name: "mysess",
    resave: true,
    saveUninitialized: true,
  })
)

app.use(urlencoded({ extended: true }))
app.use(json())

// 초기화
// app.use(mypassport.initialize())
app.use(passport.initialize())

// 세션에서 로그인 정보 복구
// app.use(mypassport.session())
app.use(passport.session())

app.get("/debug", (req: Request, res: Response) => {
  res.json({
    "req.session": req.session,
    "req.user": req.user,
    "req._passport": req._passport,
  })
})

app.get("/login", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../public/login.html"))
})

// 로그인
app.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response, next: NextFunction) => {
    res.send("로그인 성공")
  }
)

// 로그아웃
app.get("/logout", (req, res) => {
  // 세션에서 로그인 정보 제거
  req.logout()

  res.send("로그아웃 성공")
})

// 접근 권한
app.get("/profile", isAuthenticated(), (req, res) => {
  res.json(req.user)
})

app.get("*", (_, res) => res.send("passport test"))

app.listen(3000, () => console.log("Server is running ::3000"))
