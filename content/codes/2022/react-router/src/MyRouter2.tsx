import { FC, MouseEventHandler, ReactNode } from "react"

interface LinkProps {
  to: string
  children?: ReactNode
}

const Link: FC<LinkProps> = ({ to, children }) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    // 이 요청을 어디선가 처리하고 싶다.
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
    {/* <a href="/user">{`User Page >>`}</a> */}
    {/* Link 컴포넌트로 하이퍼링크를 대체한다 */}
    <Link to="/user">{`User Page >>`}</Link>
  </>
)

const UserPage = () => (
  <>
    <h1>User Page</h1>
  </>
)

export default function App() {
  const { pathname } = window.location

  if (pathname === "/user") {
    return <UserPage />
  }

  return <HomePage />
}
