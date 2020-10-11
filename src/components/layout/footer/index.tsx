import React, { FC } from "react"
import { Section } from "../../layout/content"
import * as Styled from "./style"

interface P {
  author: string
  email: string
  githubUsername: string
}

const Footer: FC<P> = ({ author, email, githubUsername }) => {
  return (
    <Styled.SiteFooter>
      <Section>
        <Styled.Copyright>
          © {author} {new Date().getFullYear()}
        </Styled.Copyright>
      </Section>
    </Styled.SiteFooter>
  )
}

export default Footer
