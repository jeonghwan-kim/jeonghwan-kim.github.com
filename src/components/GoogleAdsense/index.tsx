import React from "react"
import { Helmet } from "react-helmet"

const GoogleAdsense: React.FC = () => (
  <Helmet>
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6924464729605173"
      crossOrigin="anonymous"
    ></script>
  </Helmet>
)

export default GoogleAdsense
