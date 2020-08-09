import React from 'react';
import './category-select-modal.scss';
import Modal from '../modal';
import { Link, useStaticQuery, graphql } from 'gatsby';

const CategorySelectModal = () => {
  const data = useStaticQuery(graphql`{
    categories: allMarkdownRemark(limit: 1000) {
      group(field: frontmatter___category) {
        fieldValue
        totalCount
      }
      totalCount
    }
  }`)

  const categoryLabel = {
    dev: '개발',
    series: '연재물',
    think: '생각'
  }

  const onClick = () => {
    Modal.close();
  }

  return (
    <Modal className="category-select-modal">
      <ul>
        <li><Link to="/category/" onClick={()=>onClick()}>모든 글({data.categories.totalCount})</Link></li>
        {data.categories.group.map(c => {
          return <li key={c.fieldValue}>
            <Link to={`/category/${c.fieldValue}`} onClick={()=>onClick()}>
              {categoryLabel[c.fieldValue]}({c.totalCount})
            </Link>
            </li>
        })}
      </ul>
    </Modal>
  )
}

export default CategorySelectModal;