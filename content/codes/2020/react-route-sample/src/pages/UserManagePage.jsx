import * as React from "react"
import { ROLE } from "../componentns/RouteIf.jsx"
import RoleComponent from "../componentns/RoleComponent.jsx"

const UserManagePage = props => {
  const [users, setUsers] = React.useState([
    { id: 1, name: "alice", email: "alice@doamin.com" },
    { id: 2, name: "bek", email: "bek@doamin.com" },
    { id: 3, name: "chris", email: "chris@doamin.com" },
  ])

  const disabled = props.role !== ROLE.WRITE

  const onChange = user => {
    setUsers(
      users.map(u => {
        return u.id === user.id ? user : u
      })
    )
  }

  return (
    <>
      <h3>사용자 관리</h3>
      <RoleComponent role={props.role} />
      {users.map(user => {
        return (
          <form
            key={user.id}
            onSubmit={e => {
              e.preventDefault()
              alert("// todo 저장!")
            }}
          >
            <input
              value={user.name}
              disabled={disabled}
              onChange={e => onChange({ ...user, name: e.target.value })}
            />
            <input
              value={user.email}
              disabled={disabled}
              onChange={e => onChange({ ...user, email: e.target.value })}
            />
            {!disabled && <button type="submit">저장</button>}
          </form>
        )
      })}
    </>
  )
}

export default UserManagePage
