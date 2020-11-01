import { Link } from "gatsby"
import React, { FC } from "react"
import { MarkdownRemark } from "../../models/markdown-remark"
import { Icon, IconType } from "../icon/style"
import { TwoColumnLayout } from "../layout"
import PostList from "../PostList"
import Section from "../Section"
import SEO from "../seo"
import * as Styled from "./style"

interface CateogryPostsProps {
  title: string
  posts: MarkdownRemark[]
  activeCategory?: string
}

export const CateogryPosts: FC<CateogryPostsProps> = ({
  title,
  posts,
  activeCategory,
}) => {
  const aside = (
    <Styled.CategoryList>
      <Styled.CategoryListItem>
        <label>글분류</label>
      </Styled.CategoryListItem>
      <Styled.CategoryListItem>
        <Link to="/category" className={!activeCategory ? "active" : ""}>
          모든글
        </Link>{" "}
      </Styled.CategoryListItem>
      <Styled.CategoryListItem>
        <Link
          to="/category/series"
          className={activeCategory === "series" ? "active" : ""}
        >
          연재물
        </Link>{" "}
      </Styled.CategoryListItem>
      <Styled.CategoryListItem>
        <Link
          className={activeCategory === "dev" ? "active" : ""}
          to="/category/dev"
        >
          개발
        </Link>{" "}
      </Styled.CategoryListItem>
      <Styled.CategoryListItem>
        <Link
          to="/category/think"
          className={activeCategory === "think" ? "active" : ""}
        >
          생각
        </Link>{" "}
      </Styled.CategoryListItem>
    </Styled.CategoryList>
  )

  return (
    <TwoColumnLayout aside={aside}>
      <SEO title={`분류: ${title}`} />
      <Styled.Wrapper>
        <Section
          title={
            <>
              <Icon type={IconType.Article} size={4} />
              {title}
            </>
          }
        >
          <PostList
            posts={posts.map(p => ({
              slug: p.fields.slug,
              title: p.frontmatter.title,
              meta: <time dateTime={p.fields.date}>{p.fields.dateStr}</time>,
              excerpt: p.excerpt,
            }))}
          />
        </Section>
      </Styled.Wrapper>
    </TwoColumnLayout>
  )
}
