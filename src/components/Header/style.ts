import styled from "styled-components"
import {
  Border,
  Colors,
  Container,
  SpaceUnit,
  Widths,
} from "../../styles/style-variables"

export const Header = styled.header<{ bordered: boolean }>`
  height: ${SpaceUnit(7)};
  border-bottom: ${props => (props.bordered ? Border() : `none`)};
  padding: 0 ${SpaceUnit()};
  a {
    color: ${Colors.Black};
    text-decoration: none;
  }
  ${Container} {
    display: flex;
    align-items: center;
  }
`

export const SiteTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: lighter;
  overflow: hidden;
`

export const SiteLogo = styled.div`
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
  margin-left: ${SpaceUnit(2)};
`

export const Nav = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    display: flex;
    align-items: center;
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
  span {
    margin-left: 1px;
    @media (max-width: calc(${Widths.Tablet} - 1px)) {
      display: none !important;
    }
  }
  @media (max-width: calc(${Widths.Tablet} - 1px)) {
    i {
      width: ${SpaceUnit(4)} !important;
      height: ${SpaceUnit(4)} !important;
    }
  }
`

export const Contacts = styled.div`
  display: flex;
  @media (max-width: calc(${Widths.Tablet})) {
    display: none;
  }
`
