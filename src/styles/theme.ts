import { css } from "styled-components"

export const theme = css`
  :root,
  html[data-app-theme="light"] {
    --color-Primary: #cd5554;
    --color-Brand: #313d4b;
    --color-Secondary: #91684a;
    --color-Thenary: #00c07f;
    --color-Foreground1: #3d3d3f;
    --color-Foreground2: #505053;
    --color-Foreground3: #888;
    --color-Foreground4: rgb(230, 230, 230);
    --color-Background1: #fff;
    --color-Background2: #ddd;
    --color-Background3: #bbb;
    --color-Background4: #aaa;
  }
  html[data-app-theme="dark"] {
    --color-Primary: #cd5554;
    --color-Brand: #313d4b;
    --color-Secondary: #91684a;
    --color-Thenary: #00c07f;
    --color-Foreground1: #fff;
    --color-Foreground2: #ddd;
    --color-Foreground3: #bbb;
    --color-Foreground4: #505053;
    --color-Background1: rgb(21, 32, 43);
    --color-Background2: #333;
    --color-Background3: #555;
  }
`
