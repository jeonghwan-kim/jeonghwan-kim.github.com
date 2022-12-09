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

// 컨택스트로 값을 전달하자
const routerContext = createContext<RouterContext>({
  path: "",
  changePath: () => undefined,
})

routerContext.displayName = "RouterContext"

interface RouterProps {
  children?: ReactNode
}

const Router: FC<RouterProps> = ({ children }) => {
  // 요청한 주소를 path 상태로 관리한다.
  // 어플리케이션이 처음 요청한 주소를 기본값으로 사용한다.
  const [path, setPath] = useState(window.location.pathname)

  const contextValue: RouterContext = {
    path,
    changePath: setPath,
  }

  // 이 값을 넣어 주어야해. 컨택스트
  return (
    <routerContext.Provider value={contextValue}>
      {children}
    </routerContext.Provider>
  )
}

interface LinkProps {
  to: string
  children?: ReactNode
}

const Link: FC<LinkProps> = ({ to, children }) => {
  // 컨택스트를 사용한다.
  const { changePath } = useContext(routerContext)

  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    // 컨택스트를 통해 값을 변경한다.
    // 리액트가 App 컴포넌트를 리렌더링 할 수 있을까?
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
  </>
)

export default function App() {
  // 컨택스트의 값을 사용한다?
  const { path } = useContext(routerContext)

  // 라우터로 감싼다
  return (
    <Router>
      {path === "/user" && <UserPage />}
      {path !== "/user" && <HomePage />}
    </Router>
  )
}
