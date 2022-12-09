const HomePage = () => (
  <>
    <h1>Home Page</h1>
    <a href="/user">{`User Page >>`}</a>
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
