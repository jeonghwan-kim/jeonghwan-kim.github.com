import styled from "styled-components"
import { SpaceUnit } from "../../styles/style-variables"

export const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background-color: white;
  width: 300px;
  padding: ${SpaceUnit(8)} ${SpaceUnit()} ${SpaceUnit(4)} ${SpaceUnit(4)};
  overflow-y: auto;
`
