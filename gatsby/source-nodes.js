const series = require("../content/series.json")
const videos = require("../content/videos.json")

exports.createSeriesNode = ({ actions, createNodeId, createContentDigest }) => {
  series.forEach(s => {
    actions.createNode({
      id: createNodeId(`series-${s.title}`),
      title: s.title,
      internal: {
        type: "series",
        contentDigest: createContentDigest(s),
      },
    })
  })
}

exports.createVideoNode = ({ actions, createNodeId, createContentDigest }) => {
  videos.forEach(v => {
    actions.createNode({
      id: createNodeId(`series-${v.title}`),
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
