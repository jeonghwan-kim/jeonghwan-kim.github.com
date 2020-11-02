import styled from "styled-components"
import { Colors, SpaceUnit, Widths } from "../../styles/style-variables"

export const PostList = styled.ul`
  list-style: none;
  padding: 0;
`

export const PostItem = styled.li`
  a {
    text-decoration: none;
  }
  margin: ${SpaceUnit(7)} 0;
  text-decoration: none;
  display: block;
`

export const PostTitle = styled.h2`
  color: ${Colors.Primary};
  margin-bottom: ${SpaceUnit()};
`

export const PostMeta = styled.div`
  color: ${Colors.Gray};
`

export const PostSummary = styled.p`
  color: ${Colors.Black};
  line-height: 1.5em;
  @media (max-width: calc(${Widths.Tablet} - 1px)) {
    display: none;
  }
`
