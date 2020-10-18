import React from "react"
import { Link } from "gatsby"
import * as Styled from "./style"

interface P {
  to?: string
  href?: string
  onClick?: () => void
}

const Nav: React.FC<P> = ({ to, href, onClick, children }) => {
  const linkProps = {
    style: { overflow: "hidden" },
    onClick: e => {
      if (!to && onClick) {
        e.preventDefault()
        onClick()
      }
    },
  }
  return (
    <Styled.Nav>
      {href ? (
        <a {...linkProps} href={href}>
          {children}
        </a>
      ) : (
        <Link {...linkProps} to={`${to || "#"}`}>
          {children}
        </Link>
      )}
    </Styled.Nav>
  )
}

export default Nav
