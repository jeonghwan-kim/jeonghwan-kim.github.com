import React from "react"

import "./button.scss"
import { Link } from "gatsby"

interface P {
  type: "primary" | "secondary"
  link?: boolean
  to?: string
  className?: string
  onClick?: () => void
}
const Button: React.FC<P> = ({
  className,
  type,
  link,
  to,
  children,
  onClick,
}) => {
  if (link) {
    return (
      <Link
        className={`${className || ""} btn btn-${type || "primary"}`}
        to={to}
        onClick={() => onClick}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={`${className || ""} btn btn-${type || "primary"}`}
      onClick={() => onClick()}
    >
      {children}
    </button>
  )
}

export default Button
