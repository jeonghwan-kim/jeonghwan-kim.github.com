import styled from "styled-components"
import { ZIndex } from "../../styles/style-variables"

export const Backdrop = styled.div<{ show: boolean; onClick: () => void }>`
  position: fixed;
  inset: 0;
  z-index: ${ZIndex.Backdrop};
  cursor: pointer;
  background: ${({ show }) => (show ? "rgba(0,0,0,.45)" : "transparent")};
  opacity: ${({ show }) => (show ? 1 : 0)};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  transition: opacity 0.35s cubic-bezier(0.2, 0.7, 0, 1),
    background-color 0.35s cubic-bezier(0.2, 0.7, 0, 1);
`
