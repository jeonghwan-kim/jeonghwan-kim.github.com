import { lighten } from "polished"
import styled from "styled-components"
import { Colors, SpaceUnit } from "../../styles/style-variables"

export const Wrapper = styled.div`
  padding: ${SpaceUnit()};
`

export const CategoryList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`

export const CategoryListItem = styled.li`
  a {
    padding: ${SpaceUnit()} ${SpaceUnit()};
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: 6px;
    font-size: 14px;
    &.active {
      background-color: ${Colors.Primary};
      color: ${Colors.White};
    }
    &:hover {
      cursor: pointer;
    }
  }
`

export const CategoryListTitle = styled(CategoryListItem)`
  color: ${Colors.Gray};
  font-weight: 500;
  font-size: 12px;
  padding-left: 0;
  margin-bottom: ${SpaceUnit()};
`

export const TagList = styled(CategoryList)`
  margin-top: ${SpaceUnit(3)};
`
export const TagListTitle = styled(CategoryListTitle)``
export const TagListItem = styled(CategoryListItem)`
  display: inline-block;
  a {
    background-color: ${lighten(0.35, Colors.Gray)};
    border-radius: 4px;
    margin-right: ${SpaceUnit(0.5)};
    margin-bottom: ${SpaceUnit(0.5)};
  }
`
