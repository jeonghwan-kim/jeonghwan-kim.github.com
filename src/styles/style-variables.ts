import styled, { css } from "styled-components"

export const Colors = {
  Primary: `var(--color-Primary)`,
  Brand: `var(--color-Brand)`,
  Secondary: `var(--color-Secondary)`,
  Thenary: `var(--color-Thenary)`,
  Foreground1: `var(--color-Foreground1)`,
  Foreground2: `var(--color-Foreground2)`,
  Foreground3: `var(--color-Foreground3)`,
  Foreground4: `var(--color-Foreground4)`,
  Background1: `var(--color-Background1)`,
  Background2: `var(--color-Background2)`,
  Background3: `var(--color-Background3)`,
}

export const SpaceUnit = (size = 1) => `${size * 8}px`

export const Border = (thickness = 1) => {
  return `${thickness}px solid ${Colors.Foreground4}`
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
