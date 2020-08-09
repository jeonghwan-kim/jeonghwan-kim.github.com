import { Link } from 'gatsby';
import React from 'react';
import './series-nav.scss'
import { Series } from '../../models/site';
import { MarkdownRemark } from '../../models/markdown-remark';

interface P {
  series: Series;
  posts: MarkdownRemark[];
  nodeId: string;
  lite?: boolean;
}

const SeriesNav: React.FC<P> = ({series, posts, nodeId, lite}) => {
  const curIdx = posts.findIndex(item => {
    return item.id === nodeId
  });

  const prev = curIdx === 0 ? null : posts[curIdx - 1];
  const next = curIdx === posts.length ? null : posts[curIdx + 1]

  console.log(next)

  return lite ? renderLite() : renderDefault()

  function renderLite() {
    return (
      <div className="series-nav mb-2 py-3 px-2">
        <div className="mb-1">
          <span className="series-title">
            {series.title}
          </span>
          <span className="series-order">
            (<span className="active">{curIdx + 1}</span>/{posts.length})
          </span>
        </div>
        <div className="series-controls flex">
          {prev && (
            <span className="prev align-left">
              <Link className="btn btn-secondary" to={prev.fields.slug}>« 이전</Link>
            </span>

          )}
          {next && (
            <span className="next align-right">
              <Link className="btn btn-secondary" to={next.fields.slug}>다음 »</Link>
            </span>
          )}
        </div>
      </div>
    )
  }

  function renderDefault() {
    return (
      <div className="series-navigator px-2 pt-3 pb-2">
        <h3 className="series-title">
          { series.title }
        </h3>
        <div className="post-list">
          <ul>
            {posts.map(post => {
              const active = post.id === nodeId;
              return (
                <li className={active ? 'active' : ''} key={post.fields.slug}>
                  {active ? (
                    <div className="active">{post.frontmatter.title}</div>
                    ): (
                    <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                  )}

              </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default SeriesNav;
