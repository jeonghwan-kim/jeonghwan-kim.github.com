import React from "react"
import { Story } from "@storybook/react"
import Button, { ButtonProps } from "./index"
import { ButtonType } from "./style"

export default {
  title: "Button",
  component: Button,
}

const Template: Story<ButtonProps> = args => <Button {...args}>버튼</Button>

export const Primary = Template.bind({})
Primary.args = {
  type: ButtonType.Primary,
}

export const Secondary = Template.bind({})
Secondary.args = {
  type: ButtonType.Secondary,
}
