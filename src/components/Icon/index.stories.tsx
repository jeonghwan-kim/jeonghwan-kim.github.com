import React from "react"
import { Story } from "@storybook/react"
import Icon, { IconProps } from "./index"
import { IconType } from "./style"

export default {
  title: "Icon",
  component: Icon,
}

const Template: Story<IconProps> = args => <Icon {...args} />

export const Article = Template.bind({})
Article.args = {
  type: IconType.Article,
  size: 4,
}

export const Email = Template.bind({})
Email.args = {
  type: IconType.Email,
  size: 4,
}

export const RSS = Template.bind({})
RSS.args = {
  type: IconType.RSS,
  size: 4,
}

export const Github = Template.bind({})
Github.args = {
  type: IconType.Github,
  size: 4,
}

export const Tag = Template.bind({})
Tag.args = {
  type: IconType.Tag,
  size: 4,
}

export const Video = Template.bind({})
Video.args = {
  type: IconType.Video,
  size: 4,
}

export const Video2 = Template.bind({})
Video2.args = {
  type: IconType.Video2,
  size: 4,
}
