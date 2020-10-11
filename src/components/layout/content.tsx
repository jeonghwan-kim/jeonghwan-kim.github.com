import React, { ReactNode } from "react"
import * as Styled from "./style"

interface ContentProps {
  className?: string
}

const Content: React.FC<ContentProps> = ({ className, children }) => {
  return <div className={`content ${className || ""}`}>{children}</div>
}

export default Content

export const Section: React.FC<{ title?: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <Styled.Section>
      {title && <Styled.SectionTitle>{title}</Styled.SectionTitle>}
      {children}
    </Styled.Section>
  )
}
