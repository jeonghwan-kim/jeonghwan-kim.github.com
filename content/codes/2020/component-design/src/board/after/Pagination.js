import * as React from "react"
import "./Pagination.css"

const Pagination = ({ pagination, disabled, onPaginate }) => {
  return (
    <ul className={`Pagination ${disabled ? "disabled" : ""}`}>
      {new Array(pagination.totalPages).fill(1).map((_, idx) => {
        const page = idx + 1

        return (
          <li
            key={idx}
            className={`${page === pagination.page ? "active" : ""} `}
            onClick={() => onPaginate(page)}
          >
            {page}
          </li>
        )
      })}
    </ul>
  )
}

export default Pagination
