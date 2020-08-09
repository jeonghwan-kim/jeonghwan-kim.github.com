import React from 'react';
import { Disqus } from 'gatsby-plugin-disqus';
import { Data } from '../../models/data';
import { MarkdownRemark } from '../../models/markdown-remark';
import { Site } from '../../models/site';

interface P {
  markdownRemark: MarkdownRemark;
  site: Site;
}

const PostComment: React.FC<P> = ({markdownRemark, site}) => {

  const config: {url: string, title: string, identifier?: string} = {
    url: `${site.siteMetadata.url + markdownRemark.fields.slug}`,
    title: markdownRemark.frontmatter.title,
  }

  if (!markdownRemark.fields.beforeGatsby) {
    config.identifier = markdownRemark.id
  }

  return (
    <Disqus config={config} />
  )
}

export default PostComment;