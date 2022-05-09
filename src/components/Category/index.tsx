import { Link } from "gatsby"
import React, { FC } from "react"
import { MarkdownRemark } from "../../../graphql-types"
import { dateFormat } from "../../helpers/date"
import { Icon, IconType } from "../Icon/style"
import { TwoColumnLayout } from "../layout"
import PostList from "../PostList"
import Section from "../Section"
import SEO from "../SEO"
import * as Styled from "./style"

const categoryMap = {
  series: "연재물",
  dev: "개발",
  think: "생각",
}

interface Props {
  posts: MarkdownRemark[]
}

export const CateogryPosts: FC<Props> = ({ posts }) => {
  const category =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("key")
      : ""
  const renderedPosts = category
    ? posts.filter(p => p.frontmatter.category === category)
    : posts

  const aside = (
    <Styled.CategoryList>
      <Styled.CategoryListItem>
        <label>글분류</label>
      </Styled.CategoryListItem>
      <Styled.CategoryListItem>
        <Link to="/category" className={!category ? "active" : ""}>
          모든글
        </Link>
      </Styled.CategoryListItem>
      {Object.keys(categoryMap).map(c => (
        <Styled.CategoryListItem key={c}>
          <Link
            to={`/category?key=${c}`}
            className={c === category ? "active" : ""}
          >
            {categoryMap[c]}
          </Link>
        </Styled.CategoryListItem>
      ))}
    </Styled.CategoryList>
  )

  return (
    <TwoColumnLayout aside={aside}>
      <SEO title={`분류: ${categoryMap[category] || "모든글"}`} />
      <Styled.Wrapper>
        <Section
          title={
            <>
              <Icon type={IconType.Article} size={4} />
              {categoryMap[category] || "모든글"}
            </>
          }
        >
          <PostList
            posts={renderedPosts.map(p => ({
              slug: p.frontmatter.slug,
              title: p.frontmatter.title,
              meta: (
                <time dateTime={p.frontmatter.date}>
                  {dateFormat(p.frontmatter.date)}
                </time>
              ),
              excerpt: p.excerpt,
            }))}
          />
        </Section>
      </Styled.Wrapper>
    </TwoColumnLayout>
  )
}
