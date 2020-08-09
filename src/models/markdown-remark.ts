export interface MarkdownRemark {
  id: string;
  tableOfContents: string;
  html: string;
  excerpt: string;
  fields: Fields;
  frontmatter: Frontmatter;
}

export interface Fields {
  date: string;
  slug: string;
  beforeGatsby: boolean;
}

export interface Frontmatter {
  title: string;
  description: string;
  seriesId?: string | number;
  videoId?: string  | number;
  tags?: string[]
}