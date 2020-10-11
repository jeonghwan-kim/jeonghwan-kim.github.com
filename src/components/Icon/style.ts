import styled from "styled-components"
import { SpaceUnit } from "../../styles/style-variables"

import IconRss from "./images/icon-rss.png"
import IconArticle from "./images/icon-article.png"
import IconEmail from "./images/icon-email.png"
import IconGithub from "./images/icon-github.png"
import IconTag from "./images/icon-tag.png"
import IconVideo2 from "./images/icon-video-2.png"
import IconVideo from "./images/icon-video.png"

export enum IconType {
  RSS = "RSS",
  Article = "Article",
  Email = "Email",
  Github = "Github",
  Tag = "Tag",
  Video2 = "Video2",
  Video = "Video",
}

const IconImages: { [k in IconType]: string } = {
  [IconType.RSS]: IconRss,
  [IconType.Article]: IconArticle,
  [IconType.Email]: IconEmail,
  [IconType.Github]: IconGithub,
  [IconType.Tag]: IconTag,
  [IconType.Video2]: IconVideo2,
  [IconType.Video]: IconVideo,
}

export interface IconProps {
  type: IconType
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

export const Icon = styled.i<IconProps>`
  background: url(${props => IconImages[props.type]});
  filter: invert(1);
  display: inline-block;
  width: ${props => SpaceUnit(props.size || 3)};
  height: ${props => SpaceUnit(props.size || 3)};
  background-repeat: no-repeat;
  background-position-x: 0;
  background-position-y: 0;
  background-size: contain;
`
