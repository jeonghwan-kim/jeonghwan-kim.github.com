import React, {
  Children,
  createContext,
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

interface RouterContext {
  path: string
  changePath(value: string): void
}

const routerContext = createContext<RouterContext>({
  path: "/",
  changePath: () => undefined,
})

routerContext.displayName = "RouterContext"

interface RouterProps {
  children?: ReactNode
}
const Router: FC<RouterProps> = ({ children }) => {
  const [path, setPath] = useState(window.location.pathname)

  const changePath = (path: string) => {
    window.history.pushState({ path }, "", path)
    setPath(path)
  }

  useEffect(() => {
    const handleOnpopstate = (event: PopStateEvent) => {
      setPath(event.state?.path || "/")
    }

    window.addEventListener("popstate", handleOnpopstate)
    return () => {
      window.removeEventListener("popstate", handleOnpopstate)
    }
  }, [])

  return (
    <routerContext.Provider value={{ path, changePath }}>
      {children}
    </routerContext.Provider>
  )
}

interface RoutesProps {
  children: ReactNode
}

const Routes: FC<RoutesProps> = ({ children }) => {
  const { path } = useContext(routerContext)

  let selectedRoute = null

  Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
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
    selectedRoute = child.props.element
  })
  return selectedRoute
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
  const { path, changePath } = useContext(routerContext)

  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    if (to === path) {
      return
    }
    changePath(to)
  }

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}

const useNavigate = () => {
  const { path, changePath } = useContext(routerContext)
  const navigate = useCallback(
    (nextPath: string) => {
      if (path === nextPath) {
        return
      }

      changePath(nextPath)
    },
    [path, changePath]
  )

  return navigate
}

const UserPage: FC = () => {
  return (
    <>
      <h1>User Page</h1>
      <Link to="/">{`<< Home Page`}</Link>
    </>
  )
}

const HomePage: FC = () => {
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
      <button onClick={handleClick}>{`User Page >>`}</button>
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
