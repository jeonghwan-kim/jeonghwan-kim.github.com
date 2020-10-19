import React from "react"
import { Story } from "@storybook/react"
import { PlainLayout, PlainLayoutProps } from "."

export default {
  title: "Layout/PlainLayout",
  component: PlainLayout,
}

const Template: Story<PlainLayoutProps> = args => (
  <PlainLayout {...args}>블로그 홈</PlainLayout>
)

export const Plain = Template.bind({})
Plain.args = {}
