import styled from "styled-components"
import { lighten } from "polished"
import {
  Border,
  Colors,
  SpaceUnit,
  Widths,
} from "../../../styles/style-variables"

export const SiteHeader = styled.header<{ bordered: boolean }>`
  height: ${SpaceUnit(7)};
  border-bottom: ${props => (props.bordered ? Border() : `none`)};
  a {
    color: ${Colors.Black};
    text-decoration: none;
  }
`

export const SiteTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: lighter;
  overflow: hidden;
`

export const SiteLog = styled.div`
  a {
    display: inline-block;
    width: 100%;
    height: 28px;
    line-height: 28px;
    font-weight: bold;
    text-decoration: none;
  }
`

export const NavList = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  justify-self: center;
  height: 100%;
  margin-left: ${SpaceUnit(2)};

  @media (max-width: ${Widths.Tablet} - 1) {
    .icon {
      width: ${SpaceUnit(4)} !important;
      height: ${SpaceUnit(4)} !important;
    }
  }
`

export const NavName = styled.div`
  margin-left: 1px;
  @media (max-width: ${Widths.Tablet} - 1) {
    display: none;
  }
`

export const NavItem = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    padding: ${SpaceUnit()};
    appearance: none;
    background: transparent;
    border: none;
    color: ${Colors.Black};
    font-weight: 300;
    height: 100%;
  }
  &:last-child {
    margin-right: 0;
  }
  @media (max-width: ${Widths.Tablet} - 1) {
    .nav-title {
      display: none;
    }
  }
`

export const Contacts = styled.div`
  display: flex;
  @media (max-width: ${Widths.Tablet} - 1) {
    display: none;
  }
`
