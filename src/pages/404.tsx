import React from "react"
import { PlainLayout } from "../components/layout"
import Section from "../components/Section"
import SEO from "../components/SEO"
import { Container } from "../styles/style-variables"

const NotFoundPage = () => (
  <PlainLayout>
    <SEO title="404: Not found" />
    <Container small>
      <Section>
        <h1>페이지를 찾을 수 없습니다</h1>
        <p>찾는 페이지가 삭제되었거나 이동되었을 수 있습니다.</p>
      </Section>
    </Container>
  </PlainLayout>
)

export default NotFoundPage
