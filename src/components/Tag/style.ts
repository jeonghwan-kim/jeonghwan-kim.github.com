import styled from "styled-components"
import { Colors, Fonts, SpaceUnit } from "../../styles/style-variables"

export const TagItem = styled.div``

export const TagName = styled.h2`
  a {
    text-decoration: none;
    color: ${Colors.Primary};
    font-family: ${Fonts.Fixed};
  }
`

export const TagPostList = styled.ul`
  padding-left: 20px;
  list-style: none;
`

export const TagPostItem = styled.li`
  margin-bottom: ${SpaceUnit()};
  a {
    text-decoration: none;
    color: ${Colors.Foreground1};
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`
