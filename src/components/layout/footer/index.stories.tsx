import React from "react"
import { Story } from "@storybook/react"
import Footer, { FooterProps } from "."

export default {
  title: "Footer",
  component: Footer,
}

const Template: Story<FooterProps> = args => <Footer {...args} />

export const Basic = Template.bind({})
Basic.args = {
  bordered: true,
}
