import React from 'react';
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon, FacebookShareCount, PocketShareButton, PocketIcon } from 'react-share';
import { MarkdownRemark } from '../../models/markdown-remark';
import { SiteMetadata } from '../../models/site';

interface P {
  markdownRemark: MarkdownRemark;
  siteMetadata: SiteMetadata;
}

const PostShare: React.FC<P> = ({markdownRemark, siteMetadata}) => {
  const iconProps = {
    round: true,
    size: 8 * 6
  }

  const url = siteMetadata.url + markdownRemark.fields.slug

  return(
    <div className="flex social-share-btns">
      <div className="mr-1">
        <TwitterShareButton
          url={url}
          hashtags={[...(markdownRemark.frontmatter.tags || []), siteMetadata.title.replace(/\s/g, '')] }
        ><TwitterIcon {...iconProps} /></TwitterShareButton>
      </div>
      <div className="mr-1">
        <FacebookShareButton
          url={url}
          hashtag={'#' + siteMetadata.title.replace(/\s/g, '')}>
          <FacebookIcon {...iconProps}/>
        </FacebookShareButton>
      </div>
      <div className="mr-1">
        <PocketShareButton url={url}>
          <PocketIcon {...iconProps} />
        </PocketShareButton>
      </div>
    </div>
  )
}

export default PostShare;