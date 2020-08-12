import React from "react"
import "./nav.scss"
import { Link } from "gatsby"

interface P {
  to?: string
  href?: string
  onClick?: () => void
}

const Nav: React.FC<P> = ({ to, href, onClick, children }) => {
  const linkProps = {
    style: { overflow: "hidden" },
    className: "flex",
    onClick: e => {
      if (!to && onClick) {
        e.preventDefault()
        onClick()
      }
    },
  }
  return (
    <div className="site-nav">
      {href ? (
        <a {...linkProps} href={href}>
          {children}
        </a>
      ) : (
        <Link {...linkProps} to={`${to || "#"}`}>
          {children}
        </Link>
      )}
    </div>
  )
}

export default Nav
