/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { graphql, useStaticQuery } from "gatsby"
import { createMeta } from "./meta"
import { Site } from "../../../graphql-types"

interface SEOProps {
  title?: string
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

export default function SEO({
  title,
  description,
  date,
  url,
  image,
}: SEOProps) {
  const { site } = useStaticQuery<{ site: Site }>(query)

  const getImage = () => {
    if (!site.siteMetadata?.url) {
      return ""
    }

    const DEFAULT_IMAGE = `${site.siteMetadata.url}/assets/imgs/default-image-1024x911.png`

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
      titleTemplate={
        title
          ? `%s | ${site.siteMetadata?.title}`
          : site.siteMetadata?.title || ""
      }
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
