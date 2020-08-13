export interface MarkdownRemark {
  id: string
  tableOfContents: string
  html: string
  excerpt: string
  fields: Fields
  frontmatter: Frontmatter
}

export interface Fields {
  date: string
  dateStr?: string
  slug: string
  beforeGatsby: boolean
}

export interface Frontmatter {
  title: string
  description: string
  seriesId?: string
  videoId?: string
  tags?: string[]
  featured_image?: string
}
