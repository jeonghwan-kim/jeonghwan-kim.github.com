import React from "react"
import { HomeLayout, TwoColumnLayout } from "."

export default {
  title: "Layout/PlainLayout",
  component: HomeLayout,
}

export const Home = () => <HomeLayout>home</HomeLayout>

export const TwoColumn = () => (
  <TwoColumnLayout
    aside={
      <ul>
        <li>전체보기</li>
        <li>분류1</li>
        <li>분류2</li>
        <li>분류3</li>
      </ul>
    }
  >
    body
  </TwoColumnLayout>
)
