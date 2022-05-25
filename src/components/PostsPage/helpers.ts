export const categoryMap = {
  series: "연재물",
  dev: "개발",
  think: "생각",
}

export const getLinkHoverTitle = (name, count) =>
  `${name} ${count.toLocaleString()}개 글`
