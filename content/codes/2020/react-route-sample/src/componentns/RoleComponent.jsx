import * as React from "react"

const RoleComponent = ({ role }) => {
  return (
    <p>
      사용자 권한: <code>{role}</code>
    </p>
  )
}

export default RoleComponent
