import React, { PropsWithChildren, ReactNode } from "react"
import { useTheme } from "../../helpers/theme"
import GlobalStyle from "../../styles/GlobalStyle"
import { Container } from "../../styles/style-variables"
import Footer from "../Footer"
import Header, { HeaderProps } from "../Header"
import * as Styled from "./style"
import Sidebar from "../Sidebar"
import { PageProps } from "gatsby"
import { Query } from "../../../graphql-types"

export interface LayoutProps
  extends HeaderProps,
    PropsWithChildren,
    Pick<PageProps<Query>, "data"> {}

function Layout({ noBorder, children, data }: LayoutProps) {
  const [openSidebar, setOpenSidebar] = React.useState(false)

  useTheme()

  return (
    <>
      <GlobalStyle />
      <Header
        noBorder={noBorder}
        onClickHamburgerButton={() => setOpenSidebar(true)}
      />
      {openSidebar && (
        <Sidebar data={data} onClose={() => setOpenSidebar(false)} />
      )}
      {children}
    </>
  )
}

export function PlainLayout({ children, data }: LayoutProps) {
  return (
    <Layout data={data}>
      {children}
      <Footer bordered />
    </Layout>
  )
}

export interface HomeLayoutProps
  extends PropsWithChildren,
    Pick<PageProps<Query>, "data"> {}

export function HomeLayout({ children, data }: HomeLayoutProps) {
  return (
    <Layout noBorder data={data}>
      {children}
      <Footer bordered />
    </Layout>
  )
}

interface TwoColumnLayoutProps
  extends PropsWithChildren,
    Pick<PageProps<Query>, "data"> {
  aside: ReactNode
}

export function TwoColumnLayout({
  aside,
  children,
  data,
}: TwoColumnLayoutProps) {
  return (
    <Layout data={data}>
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
