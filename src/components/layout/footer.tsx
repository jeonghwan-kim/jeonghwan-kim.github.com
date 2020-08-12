import { Link } from "gatsby"
import React, { FC } from "react"
import "./footer.scss"
import { Section } from "../content"

interface P {
  author: string
  email: string
  githubUsername: string
}

const Footer: FC<P> = ({ author, email, githubUsername }) => {
  return (
    <footer className="site-footer">
      <Section>
        <div className="footer-copyright">
          <div>
            © {author} {new Date().getFullYear()}
          </div>
        </div>
      </Section>
    </footer>
  )
}

export default Footer
