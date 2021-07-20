/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin")

const nodes = require("./gatsby/nodes")
const pages = require("./gatsby/pages")
const sourceNodes = require("./gatsby/source-nodes")

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type === `MarkdownRemark`) {
    nodes.createMarkdown({ node, actions, getNode })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  return pages.crateBlogPost({ graphql, actions })
}

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  sourceNodes.createSeriesNode({ actions, createNodeId, createContentDigest })
  sourceNodes.createVideoNode({ actions, createNodeId, createContentDigest })
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === "develop" || stage === "build-javascript") {
    actions.setWebpackConfig({
      plugins: [new CaseSensitivePathsPlugin()],
    })
  }
}
