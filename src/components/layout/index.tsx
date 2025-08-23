import React, { PropsWithChildren, ReactNode } from "react"
import { useTheme } from "../../helpers/theme"
import GlobalStyle from "../../styles/GlobalStyle"
import { Container } from "../../styles/style-variables"
import Footer from "../Footer"
import Header, { HeaderProps } from "../Header"
import * as Styled from "./style"

export interface LayoutProps extends HeaderProps, PropsWithChildren {}

function Layout({ noBorder, children }: LayoutProps) {
  useTheme()

  return (
    <>
      <GlobalStyle />
      <Header noBorder={noBorder} />
      {children}
    </>
  )
}

export function PlainLayout({ children }: LayoutProps) {
  return (
    <Layout>
      {children}
      <Footer bordered />
    </Layout>
  )
}

export interface HomeLayoutProps extends PropsWithChildren {}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <Layout noBorder>
      {children}
      <Footer bordered />
    </Layout>
  )
}

interface TwoColumnLayoutProps extends PropsWithChildren {
  aside: ReactNode
}

export function TwoColumnLayout({ aside, children }: TwoColumnLayoutProps) {
  return (
    <Layout>
      <Container>
        <div style={{ display: "flex" }}>
          <Styled.AsideLeft>{aside}</Styled.AsideLeft>
          <div style={{ flex: "1" }}>
            {children}
            <Footer bordered />
          </div>
        </div>
      </Container>
    </Layout>
  )
}
