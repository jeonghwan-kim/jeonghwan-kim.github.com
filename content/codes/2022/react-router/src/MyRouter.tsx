import React, {
  Children,
  Component,
  createContext,
  FC,
  MouseEventHandler,
  ReactNode,
} from "react"

interface RouterContext {
  path: string
  handleChangePath(value: string): void
}

const routerContext = createContext<RouterContext>({
  path: "/",
  handleChangePath: () => undefined,
})

routerContext.displayName = "RouterContext"

interface RouterProps {
  children?: ReactNode
}

interface RouterState {
  path: string
}

export class Router extends Component<RouterProps, RouterState> {
  constructor(props: RouterProps) {
    super(props)
    this.state = {
      path: window.location.pathname,
    }
  }

  componentDidMount() {
    window.addEventListener("popstate", this.handleOnpopstate)
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handleOnpopstate)
  }

  handleChangePath = (path: string) => {
    window.history.pushState({ path }, "", path)
    this.setState({ path })
  }

  handleOnpopstate = (event: PopStateEvent) => {
    this.setState({ path: event.state?.path || "/" })
  }

  render() {
    const contextValue: RouterContext = {
      path: this.state.path,
      handleChangePath: this.handleChangePath,
    }
    return (
      <routerContext.Provider value={contextValue}>
        {this.props.children}
      </routerContext.Provider>
    )
  }
}

interface RoutesProps {
  children: ReactNode
}

export const Routes: FC<RoutesProps> = ({ children }) => {
  return (
    <routerContext.Consumer>
      {({ path }) => {
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
      }}
    </routerContext.Consumer>
  )
}

interface RouteProps {
  path: string
  element: ReactNode
}

export const Route: FC<RouteProps> = () => {
  return null
}

interface LinkProps {
  to: string
  children: ReactNode
}

export const Link: FC<LinkProps> = ({ to, children }) => {
  return (
    <routerContext.Consumer>
      {({ path, handleChangePath }) => {
        const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
          e.preventDefault()
          if (to === path) {
            return
          }
          handleChangePath(to)
        }

        return (
          <a href="/" onClick={handleClick}>
            {children}
          </a>
        )
      }}
    </routerContext.Consumer>
  )
}

function withRouter(
  WrappedComponent: FC<{ navigate: (path: string) => void }>
) {
  return function WithRouter() {
    return (
      <routerContext.Consumer>
        {({ handleChangePath, path }) => {
          const navigate = (nextPath: string) => {
            if (path === nextPath) {
              return
            }
            handleChangePath(nextPath)
          }
          return <WrappedComponent navigate={navigate} />
        }}
      </routerContext.Consumer>
    )
  }
}

const UserPage: FC = () => {
  return (
    <>
      <h1>User Page</h1>
      <Link to="/">{`<< Home Page`}</Link>
    </>
  )
}

const HomePage: FC = withRouter(function HomePage({ navigate }) {
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
})

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
