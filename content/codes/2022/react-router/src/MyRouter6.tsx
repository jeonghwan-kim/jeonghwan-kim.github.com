import React, { isValidElement, useCallback, useEffect } from "react"
import {
  Children,
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

  const changePath = (path: string) => {
    setPath(path)
    window.history.pushState("", "", path)
  }

  useEffect(() => {
    const handleOnpopstate = (event: PopStateEvent) => {
      console.log(event.state?.path)
      setPath(event.state?.path || "/")
    }

    window.addEventListener("popstate", handleOnpopstate)
    return () => {
      window.removeEventListener("popstate", handleOnpopstate)
    }
  }, [])

  const contextValue: RouterContext = {
    path,
    changePath,
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

const Routes: FC<RoutesProps> = ({ children }) => {
  const { path } = useContext(routerContext)
  let element = null

  Children.forEach(children, child => {
    if (!isValidElement(child)) {
      return
    }
    if (child.type === React.Fragment) {
      return
    }
    if (!child.props.path || !child.props.element) {
      return
    }
    if (child.props.path !== path) {
      return
    }
    element = child.props.element
  })
  return element
}

interface RouteProps {
  path: string
  element: ReactNode
}

const Route: FC<RouteProps> = () => null

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

// 주소를 이동한다.
const useNavigate = () => {
  // 컨택스트를 가져온다
  const { path, changePath } = useContext(routerContext)
  const navigate = useCallback(
    (nextPath: string) => {
      // 이전 주소와 이동할 주소가 같으면 멈춘다.
      if (path === nextPath) {
        return
      }

      // 주소를 변경한다
      changePath(nextPath)
    },
    [path, changePath]
  )

  return navigate
}

const HomePage = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/user")
  }

  return (
    <>
      <h1>Home Page</h1>
      <Link to="/user">{`User Page >>`}</Link>
      <br />
      <br />
      {/* 네비게이션 버튼 */}
      <button onClick={handleClick}>{`User Page >>`}</button>
    </>
  )
}

const UserPage = () => (
  <>
    <h1>User Page</h1>
    <Link to="/">{`Home Page >>`}</Link>
  </>
)

const App = () => (
  <Router>
    <Routes>
      <Route path="/user" element={<UserPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>
)

export default App
