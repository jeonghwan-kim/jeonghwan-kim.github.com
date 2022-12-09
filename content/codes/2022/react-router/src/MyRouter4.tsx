import {
  createContext,
  FC,
  MouseEventHandler,
  ReactNode,
  useContext,
  useState,
} from "react"

interface RouterContext {
  path: string
  changePath(value: string): void
}

const routerContext = createContext<RouterContext>({
  path: "",
  changePath: () => undefined,
})

routerContext.displayName = "RouterContext"

interface RouterProps {
  children?: ReactNode
}

const Router: FC<RouterProps> = ({ children }) => {
  const [path, setPath] = useState(window.location.pathname)

  const contextValue: RouterContext = {
    path,
    changePath: setPath,
  }

  return (
    <routerContext.Provider value={contextValue}>
      {children}
    </routerContext.Provider>
  )
}

interface RoutesProps {
  children?: ReactNode
}

// Router 하위에 사용할 컴포넌트
const Routes: FC<RoutesProps> = ({ children }) => {
  const { path } = useContext(routerContext)

  // 단순히 이동
  // 도메인 로직이 있다.
  return (
    <>
      {path === "/user" && <UserPage />}
      {path !== "/user" && <HomePage />}
    </>
  )
}

interface LinkProps {
  to: string
  children?: ReactNode
}

const Link: FC<LinkProps> = ({ to, children }) => {
  const { changePath } = useContext(routerContext)

  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    changePath(to)
  }

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}

const HomePage = () => (
  <>
    <h1>Home Page</h1>
    <Link to="/user">{`User Page >>`}</Link>
  </>
)

const UserPage = () => (
  <>
    <h1>User Page</h1>
    <Link to="/">{`Home Page >>`}</Link>
  </>
)

const App = () => (
  <Router>
    <Routes />
  </Router>
)

export default App
