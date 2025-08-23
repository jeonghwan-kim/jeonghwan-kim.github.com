const path = require("path")
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin")
const videos = require("./content/videos.json")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // 모든 마크다운 데이터 가져오기
  const allMarkdowns = await graphql(`
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            frontmatter {
              slug
              date
              title
              category
              series
              videoId
            }
          }
        }
      }
    }
  `)

  if (allMarkdowns.errors) {
    throw allMarkdowns.errors
  }

  const nodes = allMarkdowns.data.allMarkdownRemark.edges.map(e => e.node)

  // 마크다운으로 페이지 생성
  nodes.forEach(({ frontmatter: { slug, date, series, videoId } }, index) => {
    createPage({
      path: slug,
      component: path.resolve(__dirname, `./src/templates/blog-post/index.tsx`),
      context: {
        slug, // $slug에 주입
        date,
        series, // $series에 주입
        videoId, // $videoId에 주입
        previous: index === nodes.length - 1 ? null : nodes[index + 1],
        next: index === 0 ? null : nodes[index - 1],
      },
    })
  })

  // 포스트 연도 목록 추출
  const years = Array.from(
    new Set(nodes.map(node => new Date(node.frontmatter.date).getFullYear()))
  )
  years.forEach(year => {
    createPage({
      path: `/year/${year}`,
      component: path.resolve(__dirname, `./src/templates/year/index.tsx`),
      context: {
        year,
        startDate: `${year}-01-01`,
        endDate: `${year + 1}-01-01`,
      },
    })
  })
}

exports.sourceNodes = ({ actions, createContentDigest }) => {
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
