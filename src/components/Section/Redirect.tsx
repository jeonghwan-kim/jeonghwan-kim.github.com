import React from "react"
import { Helmet } from "react-helmet"

interface RedirectProps {
  to: string
}

const Redirect: React.FC<RedirectProps> = ({ to }) => (
  <Helmet>
    <title>Redirecting</title>
    <meta httpEquiv="refresh" content={`0; URL=${to}`} />
    <link rel="canonical" href={to} />
  </Helmet>
)

export default Redirect
