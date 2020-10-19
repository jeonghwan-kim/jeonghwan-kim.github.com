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
  return (
    <>
      <GlobalStyle />
      <Header {...p} />
      {p.aside ? (
        <div className="container flex">
          <Styled.AsideLeft>{p.aside}</Styled.AsideLeft>
          <div>
            <Styled.Main hasAside>{p.children}</Styled.Main>
            <Footer bordered />
          </div>
        </div>
      ) : (
        <>
          <Styled.Main>{p.children}</Styled.Main>
          <Footer bordered />
        </>
      )}
    </>
  )
}

export default Layout

export interface PlainLayoutProps {}

export const PlainLayout: FC<PlainLayoutProps> = ({ children }) => {
  return (
    <Layout>
      <Header />
      <Styled.Main>{children}</Styled.Main>
      <Footer bordered />
    </Layout>
  )
}

interface PostLayoutProps {}

export const PostLayout: FC<PostLayoutProps> = ({ children }) => {
  return <Layout>{children}</Layout>
}

interface TwoColumnLayoutProps {}

export const TwoColumnLayout: FC<TwoColumnLayoutProps> = ({ children }) => {
  return <Layout>{children}</Layout>
}
