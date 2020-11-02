import { lighten } from "polished"
import styled, { css } from "styled-components"

export const Colors = {
  Primary: "#cd5554",
  Gray: "gray",
  Black: "#3d3d3f",
  Brand: "#313d4b",
  Secondary: "#91684a",
  Thenary: "#00c07f",
  White: "#f9f8fd",
}

export const SpaceUnit = (size = 1) => `${size * 8}px`

export const Border = (thickness = 1) => {
  return `${thickness}px solid ${lighten(0.4, Colors.Gray)}`
}

export const Fonts = {
  Base: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
  Article: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
  Fixed: `"SF Mono", "Menlo", Courier, "Lucida Console", monospace`,
}

export const Widths = {
  Site: "1024px",
  Mobile: "320px", // iphone5
  Tablet: "768px", // ipad
  Desktop: "1024px",
  Content: "800px",
}

export const container = css`
  max-width: ${Widths.Site};
  margin-left: auto;
  margin-right: auto;
  height: 100%;
`
export const containerSm = css`
  ${container};
  max-width: ${Widths.Content};
`

export const Container = styled.div<{ small?: boolean }>`
  ${props => (props.small ? containerSm : container)}
`
