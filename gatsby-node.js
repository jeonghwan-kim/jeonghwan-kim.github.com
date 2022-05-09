const path = require("path")
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin")
const series = require("./content/series.json")
const videos = require("./content/videos.json")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve(
    __dirname,
    `./src/templates/blog-post/index.tsx`
  )

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            frontmatter {
              slug
              date
              title
              category
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

  const nodes = result.data.allMarkdownRemark.edges.map(e => e.node)

  nodes.forEach(({ frontmatter: { slug, date, seriesId, videoId } }, index) => {
    createPage({
      path: slug,
      component: blogPostTemplate,
      context: {
        slug,
        date,
        seriesId,
        videoId,
        previous: index === nodes.length - 1 ? null : nodes[index + 1],
        next: index === 0 ? null : nodes[index - 1],
      },
    })
  })
}

exports.sourceNodes = ({ actions, createContentDigest }) => {
  series.forEach(s => {
    actions.createNode({
      id: s.id,
      title: s.title,
      internal: {
        type: "series",
        contentDigest: createContentDigest(s),
      },
    })
  })

  videos.forEach(v => {
    actions.createNode({
      id: v.id,
      title: v.title,
      thumb: v.thumb,
      url: v.url,
      internal: {
        type: "video",
        contentDigest: createContentDigest(v),
      },
    })
  })
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === "develop" || stage === "build-javascript") {
    actions.setWebpackConfig({
      plugins: [new CaseSensitivePathsPlugin()],
    })
  }
}
