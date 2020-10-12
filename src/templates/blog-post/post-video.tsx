import React from "react"
import { Video } from "../../models/site"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import * as Styled from "./style"

interface P {
  video: Video
}

const PostVideo: React.FC<P> = ({ video }) => {
  return (
    <Styled.PostVideo>
      <a
        id="post-video"
        href={video.url}
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
