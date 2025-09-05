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
              tags
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

  // 포스트 페이지 생성
  nodes.forEach(({ frontmatter: { slug, date, series, videoId } }, index) => {
    createPage({
      path: slug,
      component: path.resolve(__dirname, `./src/templates/post/index.tsx`),
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

  // 연도별 페이지 생성
  const years = Array.from(
    new Set(
      nodes
        .map(node => node.frontmatter.date)
        .filter(Boolean)
        .map(date => new Date(date).getFullYear())
    )
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

  // 태그별 페이지 생성
  const tags = Array.from(
    nodes.reduce((acc, node) => {
      if ((node.frontmatter.tags || []).length) {
        acc.add(...node.frontmatter.tags)
      }
      return acc
    }, new Set())
  ).filter(Boolean)
  tags.forEach(tag => {
    createPage({
      path: `/tag/${tag}`,
      component: path.resolve(__dirname, `./src/templates/tag/index.tsx`),
      context: {
        tag,
      },
    })
  })

  // 시리즈별 페이지 생성
  const seriesList = Array.from(
    new Set(nodes.map(node => node.frontmatter.series))
  ).filter(Boolean)

  console.log("seriesList", seriesList)
  seriesList.forEach(series => {
    createPage({
      path: `/series/${series}`,
      component: path.resolve(__dirname, `./src/templates/series/index.tsx`),
      context: {
        series,
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
