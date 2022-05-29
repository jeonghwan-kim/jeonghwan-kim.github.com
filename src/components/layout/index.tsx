import React, { FC, ReactNode, useEffect } from "react"
import GlobalStyle from "../../styles/GlobalStyle"
import { Container } from "../../styles/style-variables"
import Footer from "../Footer"
import Header, { HeaderProps } from "../Header"
import * as Styled from "./style"

export interface LayoutProps extends HeaderProps {}

const Layout: FC<LayoutProps> = ({ noBorder, children }) => {
  const mediaQuery = "(prefers-color-scheme: dark)"
  const setTheme = (mediaQueryList: MediaQueryList | MediaQueryListEvent) => {
    const theme = mediaQueryList.matches ? "dark" : "light"
    document.querySelector("html").setAttribute("data-app-theme", theme)
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    setTheme(window.matchMedia("(prefers-color-scheme: dark)"))
  }, [])

  useEffect(() => {
    window.matchMedia(mediaQuery).addEventListener("change", setTheme)
  }, [])

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

export interface HomeLayoutProps {}

export const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
  return (
    <Layout noBorder>
      <Styled.Main>{children}</Styled.Main>
      <Footer bordered />
    </Layout>
  )
}

interface TwoColumnLayoutProps {
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
