import React, { FC, PropsWithChildren, ReactNode } from "react"
import { useTheme } from "../../helpers/theme"
import GlobalStyle from "../../styles/GlobalStyle"
import { Container } from "../../styles/style-variables"
import Footer from "../Footer"
import Header, { HeaderProps } from "../Header"
import * as Styled from "./style"

export interface LayoutProps extends HeaderProps, PropsWithChildren {}

const Layout: FC<LayoutProps> = ({ noBorder, children }) => {
  useTheme()

  return (
    <>
      <GlobalStyle />
      <Header noBorder={noBorder} />
      {children}
    </>
  )
}

export default Layout

export const PlainLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <Layout>
      <Styled.Main>{children}</Styled.Main>
      <Footer bordered />
    </Layout>
  )
}

export interface HomeLayoutProps extends PropsWithChildren {}

export const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
  return (
    <Layout noBorder>
      <Styled.Main>{children}</Styled.Main>
      <Footer bordered />
    </Layout>
  )
}

interface TwoColumnLayoutProps extends PropsWithChildren {
  aside: ReactNode
}

export const TwoColumnLayout: FC<TwoColumnLayoutProps> = ({
  aside,
  children,
}) => {
  return (
    <Layout>
      <Container>
        <div style={{ display: "flex" }}>
          <Styled.AsideLeft>{aside}</Styled.AsideLeft>
          <div style={{ flex: "1" }}>
            <Styled.Main>{children}</Styled.Main>
            <Footer bordered />
          </div>
        </div>
      </Container>
    </Layout>
  )
}
