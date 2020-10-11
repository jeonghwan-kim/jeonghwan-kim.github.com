import styled from "styled-components"
import { Colors, SpaceUnit } from "../../styles/style-variables"

export enum ButtonType {
  Primary = "Primary",
  Secondary = "Secondary",
}

const color: { [k in ButtonType]: string } = {
  [ButtonType.Primary]: Colors.Primary,
  [ButtonType.Secondary]: Colors.Secondary,
}

export const Button = styled.button<{ type: ButtonType }>`
  display: inline-block;
  padding: ${SpaceUnit()} ${SpaceUnit(2)};
  border-radius: 4px;
  background-color: ${Colors.White};
  text-decoration: none;
  color: ${props => color[props.type]};
  border: solid 1px ${props => color[props.type]};
  &:focus,
  &:hover {
    background-color: ${props => color[props.type]};
    color: ${Colors.White};
    cursor: pointer;
  }
`

export const ButtonLink = styled(Button)`
  a {
    text-decoration: none;
    color: inherit;
  }
`
