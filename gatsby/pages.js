const path = require(`path`)
const qs = require("querystring")

exports.crateBlogPost = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { fields: fields___date, order: DESC }) {
        edges {
          node {
            fields {
              slug
              date
              beforeGatsby
            }
            frontmatter {
              title
              category
              permalink
              seriesId
              videoId
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges.map(e => e.node)

  posts.forEach((p, i) => {
    createPage({
      path: qs.unescape(p.fields.slug),
      component: path.resolve(`./src/templates/blog-post/index.tsx`),
      context: {
        slug: p.fields.slug,
        date: p.fields.date,
        seriesId: p.frontmatter.seriesId,
        videoId: p.frontmatter.videoId,
        previous: i === posts.length - 1 ? null : posts[i + 1],
        next: i === 0 ? null : posts[i - 1],
      },
    })
  })
}
