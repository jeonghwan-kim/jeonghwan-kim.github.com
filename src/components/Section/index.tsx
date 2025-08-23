import React, { PropsWithChildren, ReactNode } from "react"
import * as Styled from "./style"

const Section: React.FC<{ title?: ReactNode } & PropsWithChildren> = ({
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

export default Section
