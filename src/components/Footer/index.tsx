import React, { FC } from "react"
import Section from "../Section"
import * as Styled from "./style"

export interface FooterProps {
  bordered?: boolean
}

const Footer: FC<FooterProps> = props => {
  return (
    <Styled.Footer {...props}>
      <Section>
        <Styled.Copyright>© 김정환 {new Date().getFullYear()}</Styled.Copyright>
      </Section>
    </Styled.Footer>
  )
}

export default Footer
