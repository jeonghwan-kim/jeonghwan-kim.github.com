import React from 'react';
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon, FacebookShareCount, PocketShareButton, PocketIcon } from 'react-share';
import { MarkdownRemark } from '../../models/markdown-remark';
import { SiteMetadata } from '../../models/site';

import './post-share.scss';

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
    <ul className="post-share">
      <li>
        <TwitterShareButton
          url={url}
          hashtags={[...(markdownRemark.frontmatter.tags || []), siteMetadata.title.replace(/\s/g, '')] }
        ><TwitterIcon {...iconProps} /></TwitterShareButton>
      </li>
      <li>
        <FacebookShareButton
          url={url}
          hashtag={'#' + siteMetadata.title.replace(/\s/g, '')}>
          <FacebookIcon {...iconProps}/>
        </FacebookShareButton>
      </li>
      <li>
        <PocketShareButton url={url}>
          <PocketIcon {...iconProps} />
        </PocketShareButton>
      </li>
    </ul>
  )
}

export default PostShare;