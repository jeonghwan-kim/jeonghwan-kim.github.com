import styled from "styled-components"
import { lighten } from "polished"
import { Colors, SpaceUnit } from "../../styles/style-variables"

export const CategoryList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`

export const CategoryListItem = styled.li`
  a,
  label {
    padding: ${SpaceUnit(2)} ${SpaceUnit(4)};
    display: flex;
    align-items: center;
  }
  label {
    color: ${Colors.Gray};
    font-weight: 200;
  }
  a {
    text-decoration: none;
    &::before {
      content: "";
      border-radius: 50%;
      display: inline-block;
      margin-left: ${SpaceUnit(-3)};
      margin-right: ${SpaceUnit(3)};
      position: absolute;
      border: solid 0 ${Colors.Primary};
      transition: border-width linear 0.1s;
    }
    &.active {
      &::before {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        height: ${SpaceUnit()};
        margin-left: ${SpaceUnit(-4)};
        margin-right: ${SpaceUnit()};
        width: ${SpaceUnit(3)};
        background-color: ${Colors.Primary};
      }
    }
    &:not(.active):hover {
      &::before {
        border-width: 4px;
        transition: border-width linear 0.1s;
      }
    }
    &:hover {
      background-color: ${lighten(0.4, Colors.Primary)};
      color: ${Colors.Primary};
      cursor: pointer;
    }
  }
`

export const Wrapper = styled.div`
  padding-left: ${SpaceUnit(4)};
`
