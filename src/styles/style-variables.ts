import styled, { css } from "styled-components"

const LightColors = {
  Primary: "#cd5554",
  Brand: "#313d4b",
  Secondary: "#91684a",
  Thenary: "#00c07f",
  Foreground1: "#3d3d3f",
  Foreground2: "#505053",
  Foreground3: "#888",
  Foreground4: "rgb(230, 230, 230)",
  Background1: "#fff",
  Background2: "#ddd",
  Background3: "#bbb",
}

const DarkColors = {
  Primary: "#cd5554",
  Brand: "#313d4b",
  Secondary: "#91684a",
  Thenary: "#00c07f",
  Foreground1: "#fff",
  Foreground2: "#ddd",
  Foreground3: "#bbb",
  Foreground4: "#505053",
  Background1: "rgb(21, 32, 43)",
  Background2: "#333",
  Background3: "#555",
}

export const Colors = LightColors
// todo 다크테마 사용하기
// export const Colors = DarkColors

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
