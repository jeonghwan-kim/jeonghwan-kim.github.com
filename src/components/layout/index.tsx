/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import { graphql, useStaticQuery } from "gatsby"
import React, { FC, ReactNode } from "react"
import GlobalStyle from "../../styles/GlobalStyle"
import Footer from "./footer"
import Header from "./header"
import * as Styled from "./style"

interface P {
  hasHeaderBorder?: boolean
  aside?: ReactNode
}

const Layout: FC<P> = p => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          author
          title
          social {
            email
            githubUsername
          }
        }
      }
    }
  `)

  const { author, title, social } = data.site.siteMetadata

  return (
    <>
      <GlobalStyle />
      <Header {...p} />
      {p.aside ? (
        <div className="container flex">
          <Styled.AsideLeft>{p.aside}</Styled.AsideLeft>
          <div>
            <Styled.Main hasAside>{p.children}</Styled.Main>
            <Footer
              author={author}
              githubUsername={social.githubUsername}
              email={social.email}
            />
          </div>
        </div>
      ) : (
        <>
          <Styled.Main>{p.children}</Styled.Main>
          <Footer
            author={author}
            githubUsername={social.githubUsername}
            email={social.email}
          />
        </>
      )}
    </>
  )
}

export default Layout

// interface PlainLayoutProps {}

// export const PlainLayout: FC<PlainLayoutProps> = ({ children }) => {
//   return <Layout>{children}</Layout>
// }

// interface PostLayoutProps {}

// export const PostLayout: FC<PostLayoutProps> = ({ children }) => {
//   return <Layout>{children}</Layout>
// }

// interface TwoColumnLayoutProps {}

// export const TwoColumnLayout: FC<TwoColumnLayoutProps> = ({ children }) => {
//   return <Layout>{children}</Layout>
// }
