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
  slug?: string
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

  const meta = [
    {
      name: `description`,
      content: description,
    },
    {
      property: `og:site_name`,
      content: site.siteMetadata.title,
    },
    {
      property: `og:title`,
      content: p.title,
    },
    {
      property: `og:description`,
      content: description,
    },
    {
      property: `og:image`,
      content: image,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      property: `og:locale`,
      content: `ko_KR`,
    },
    {
      property: `og:url`,
      content: `ko_KR`,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: site.siteMetadata.social.twitterUsername,
    },
    {
      name: `twitter:title`,
      content: p.title,
    },
    {
      name: `twitter:description`,
      content: description,
    },
    {
      name: `twitter:image`,
      content: image,
    },
  ]

  if (p.date) {
    meta.push({
      name: "article:published_time",
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
          "url": "${site.siteMetadata.url + p.slug}",
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
