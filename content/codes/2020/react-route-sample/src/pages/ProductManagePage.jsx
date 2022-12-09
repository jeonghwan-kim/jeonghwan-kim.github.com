import * as React from "react"
import RoleComponent from "../componentns/RoleComponent.jsx"

const ProductManagePage = props => {
  return (
    <>
      <h3>상품 관리</h3>
      <RoleComponent role={props.role} />
    </>
  )
}

export default ProductManagePage
