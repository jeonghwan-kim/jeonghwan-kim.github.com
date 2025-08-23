import React from "react"
import * as Styled from "./style"

export default function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <Styled.HamburgerButton onClick={onClick}>
      <span />
      <span />
      <span />
    </Styled.HamburgerButton>
  )
}
