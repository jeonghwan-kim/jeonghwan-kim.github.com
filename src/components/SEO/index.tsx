/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { createMeta } from "./meta"
import { Site } from "../../../graphql-types"

interface SEOProps {
  title: string
  description?: string
  date?: string
  url?: string
  image?: string
}

export interface MetaProps {
  property?: string
  name?: string
  content: string
}

const SEO: React.FC<SEOProps> = ({ title, description, date, url, image }) => {
  const { site } = useStaticQuery<{ site: Site }>(query)

  const getImage = () => {
    if (!site.siteMetadata?.url) {
      return ""
    }

    const DEFAULT_IMAGE = `${site.siteMetadata.url}/assets/imgs/me.jpg`

    if (image) {
      return image?.startsWith(site.siteMetadata.url)
        ? image
        : `${site.siteMetadata.url}${image}`
    }

    return DEFAULT_IMAGE
  }

  const meta = createMeta({
    siteTitle: site.siteMetadata?.title || "",
    siteDescription: description || site.siteMetadata?.description || "",
    url: url || site.siteMetadata?.url || "",
    image: getImage(),
    title,
  })

  return (
    <Helmet
      htmlAttributes={{
        lang: "ko",
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata?.title}`}
      meta={meta}
    >
      {date && (
        <script type="application/ld+json">{`
        {
          "@context": "http://schema.org",
          "@type": "BlogPosting",
          "url": "${url}",
          "headline": "${title}",
          "datePublished": "${date}",
          "dateModified": "${date}",
          "image": "${image}"
        }
        `}</script>
      )}
    </Helmet>
  )
}

export default SEO

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        title
        description
        author
        url
      }
    }
  }
`
