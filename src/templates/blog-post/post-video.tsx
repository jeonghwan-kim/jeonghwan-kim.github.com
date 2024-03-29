import React from "react"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import * as Styled from "./style"
import { Video } from "../../../graphql-types"

interface Props {
  video: Video
}

const PostVideo: React.FC<Props> = ({ video }) => {
  return (
    <Styled.PostVideo>
      <a
        id="post-video"
        href={video.url}
        target="_blank"
        title={`"${video.title}" 영상 보기`}
        onClick={e => {
          trackCustomEvent({
            category: "포스트/관련영상",
            action: "click",
            label: video.title,
          })
        }}
      >
        <img src={video.thumb} />
        <div className="post-video-overlay">
          <div className="video-icon-wrapper">
            <div className="video-icon"></div>
          </div>
          <div className="post-video-title">
            {video.title ? video.title : "영상 더보기"} &raquo;
          </div>
        </div>
      </a>
    </Styled.PostVideo>
  )
}

export default PostVideo
