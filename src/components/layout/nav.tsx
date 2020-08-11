import React from "react"
import "./nav.scss"
import { Link } from "gatsby"

interface P {
  to?: string
  onClick?: () => void
}

const Nav: React.FC<P> = ({ to, onClick, children }) => {
  return (
    <div className="site-nav">
      <Link
        style={{ overflow: "hidden" }}
        className="flex"
        to={`${to || "#"}`}
        onClick={e => {
          if (!to && onClick) {
            e.preventDefault()
            onClick()
          }
        }}
      >
        {children}
      </Link>
    </div>
  )
}

export default Nav
