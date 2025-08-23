import styled from "styled-components"
import {
  Border,
  Colors,
  Container,
  SpaceUnit,
  Widths,
} from "../../styles/style-variables"
import { PropsWithChildren } from "react"

export const Header = styled.header<PropsWithChildren>`
  height: ${SpaceUnit(7)};
  border-bottom: ${Border()};
  padding: 0 ${SpaceUnit()};
  a {
    color: ${Colors.Foreground1};
    text-decoration: none;
  }
  display: flex;
  align-items: center;
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
  font-style: italic;
  padding-right: 8px;
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
    color: ${Colors.Foreground1};
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

export const HamburgerButton = styled.button<
  PropsWithChildren<{ onClick: () => void }>
>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60px;
  height: 30px;
  background: none;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  padding: 6px 18px;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: #333;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    background-color: ${Colors.Background2};
  }
`
