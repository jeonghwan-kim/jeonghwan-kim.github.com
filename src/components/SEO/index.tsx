/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { Site } from "../../models/site"
import { createMeta, CreateMetaProps } from "./meta"

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
  const { site } = useStaticQuery<{ site: Site }>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            url
            social {
              twitterUsername
            }
          }
        }
      }
    `
  )

  const getImage = () => {
    const DEFAULT_IMAGE = `${site.siteMetadata.url}/assets/imgs/me.jpg`

    if (image) {
      return image?.startsWith(site.siteMetadata.url)
        ? image
        : `${site.siteMetadata.url}${image}`
    }

    return DEFAULT_IMAGE
  }

  const meta = createMeta({
    siteTitle: site.siteMetadata.title,
    siteDescription: description || site.siteMetadata.description,
    url: url || site.siteMetadata.url,
    image: getImage(),
    title,
    twitterUsername: site.siteMetadata.social.twitterUsername,
  })

  return (
    <Helmet
      htmlAttributes={{
        lang: "ko",
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
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
