import * as React from "react"
import { Route } from "react-router-dom"
import FobiddenPage from "../pages/FobiddenPage.jsx"

export const ROLE = {
  NONE: "NONE",
  READ: "READ",
  WRITE: "WRITE",
}

const RouteIf = ({ role, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (role === ROLE.NONE) {
          return <FobiddenPage />
        }

        if (Component) {
          return <Component {...props} role={role} />
        }

        return null
      }}
    />
  )
}

export default RouteIf
