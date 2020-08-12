import React, { ReactNode, CSSProperties } from "react"
import "./content.scss"

interface ContentProps {
  className?: string
}

const Content: React.FC<ContentProps> = ({ className, children }) => {
  return <div className={`content ${className || ""}`}>{children}</div>
}

export default Content

interface SectionProps {
  title?: ReactNode
  className?: string
  style?: CSSProperties
}

export const Section: React.FC<SectionProps> = p => {
  return (
    <section className={p.className ? p.className : ""} style={p.style}>
      {p.title && <h2 className="section-title">{p.title}</h2>}
      {p.children}
    </section>
  )
}
