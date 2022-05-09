import React from "react"
import {
  FacebookIcon,
  FacebookShareButton,
  PocketIcon,
  PocketShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share"
import { MarkdownRemark, SiteSiteMetadata } from "../../../graphql-types"
import * as Styled from "./style"

interface P {
  markdownRemark: MarkdownRemark
  siteMetadata: SiteSiteMetadata
}

const PostShare: React.FC<P> = ({ markdownRemark, siteMetadata }) => {
  const iconProps = {
    round: true,
    size: 8 * 6,
  }

  const url = siteMetadata.url + markdownRemark.frontmatter.slug

  return (
    <Styled.ShareList>
      <Styled.ShareItem>
        <TwitterShareButton
          url={url}
          hashtags={[
            ...(markdownRemark.frontmatter.tags || []),
            siteMetadata.title.replace(/\s/g, ""),
          ]}
        >
          <TwitterIcon {...iconProps} />
        </TwitterShareButton>
      </Styled.ShareItem>
      <Styled.ShareItem>
        <FacebookShareButton
          url={url}
          hashtag={"#" + siteMetadata.title.replace(/\s/g, "")}
        >
          <FacebookIcon {...iconProps} />
        </FacebookShareButton>
      </Styled.ShareItem>
      <Styled.ShareItem>
        <PocketShareButton url={url}>
          <PocketIcon {...iconProps} />
        </PocketShareButton>
      </Styled.ShareItem>
    </Styled.ShareList>
  )
}

export default PostShare
