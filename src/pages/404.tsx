import React from "react"
import Content, { Section } from "../components/content"

import Layout from "../components/layout/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <Content className="container-sm">
      <Section>
        <h1>페이지를 찾을 수 없습니다</h1>
        <p>찾는 페이지가 삭제되었거나 이동되었을 수 있습니다.</p>
      </Section>
    </Content>
  </Layout>
)

export default NotFoundPage
