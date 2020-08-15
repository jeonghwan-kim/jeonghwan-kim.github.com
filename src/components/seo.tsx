/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

interface P {
  title: string
  description?: string
  date?: string
  url?: string
  image?: string
}

const SEO: React.FC<P> = p => {
  const { site } = useStaticQuery(
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

  const description = p.description || site.siteMetadata.description
  const image = p.image || `${site.siteMetadata.url}/assets/imgs/me.jpg`
  const { twitterUsername } = site.siteMetadata.social
  const url = p.url || site.siteMetadata.url

  const meta: { property?: string; name?: string; content: string }[] = [
    {
      property: `og:locale`,
      content: `ko_KR`,
    },
    {
      property: `og:locale:alternate`,
      content: `en_US`,
    },
    {
      property: `og:site_name`,
      content: site.siteMetadata.title,
    },
    {
      property: `description`,
      content: description,
    },
    {
      property: `og:url`,
      content: url,
    },
    {
      property: `og:title`,
      content: p.title,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      property: `og:description`,
      content: description,
    },
    {
      property: `og:image`,
      content: image,
    },
  ]

  if (twitterUsername) {
    meta.push(
      ...[
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:site`,
          content: twitterUsername,
        },
        {
          name: `twitter:creator`,
          content: twitterUsername,
        },
      ]
    )
  }

  if (p.date) {
    meta.push({
      property: "article:published_time",
      content: p.date,
    })
  }

  return (
    <Helmet
      htmlAttributes={{
        lang: "ko",
      }}
      title={p.title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={meta}
    >
      {p.date && (
        <script type="application/ld+json">{`
        {
          "@context": "http://schema.org",
          "@type": "BlogPosting",
          "url": "${url}",
          "headline": "${p.title}",
          "datePublished": "${p.date}",
          "dateModified": "${p.date}",
          "image": "${image}"
        }
        `}</script>
      )}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.12/clipboard.min.js"></script>
    </Helmet>
  )
}

export default SEO
