import React from "react"
import { Story } from "@storybook/react"
import Header, { HeaderProps } from "."

export default {
  title: "Header",
  component: Header,
}

const Template: Story<HeaderProps> = args => <Header {...args} />

export const Basic = Template.bind({})
Basic.args = {
  hasHeaderBorder: true,
}
