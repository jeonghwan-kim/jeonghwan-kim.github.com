import React, { CSSProperties } from "react"
import * as Styled from "./style"

interface IconProps extends Styled.IconProps {
  style?: CSSProperties
}

const Icon: React.FC<IconProps> = props => {
  return <Styled.Icon {...props} />
}

export default Icon
