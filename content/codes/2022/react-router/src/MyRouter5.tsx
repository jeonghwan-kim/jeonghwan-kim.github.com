import React, { isValidElement, useEffect } from "react"
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

  // 상태와 주소를 변경한다.
  const changePath = (path: string) => {
    setPath(path)
    // 주소를 변경한다
    window.history.pushState("", "", path)
  }

  // popstate 이벤트가 발생하면 path 상태를 갱신한다.
  // 리액트가 이 상태를 사용하는 컴포넌트를 다시 그릴 것이다.
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
    // changePath 값을 새로 만든 함수로 교체한다.
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
    <Routes>
      <Route path="/user" element={<UserPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>
)

export default App
