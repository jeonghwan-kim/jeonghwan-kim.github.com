import * as React from "react"
import RoleComponent from "../componentns/RoleComponent.jsx"

const AuthManagePage = props => {
  return (
    <>
      <h3>권한 관리</h3>
      <RoleComponent role={props.role} />
    </>
  )
}

export default AuthManagePage
