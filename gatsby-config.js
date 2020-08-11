module.exports = {
  siteMetadata: {
    title: `김정환 블로그`,
    description: `주로 웹 기술에 대해 이야기 합니다`,
    author: `김정환`,
    url: "https://jeonghwan-kim.github.io",
    social: {
      email: "ej88ej@gmail.com",
      twitterUsername: "jeonghwan0424",
      githubUsername: "jeonghwan-kim",
    },
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 726,
            },
          },
          `gatsby-remark-prismjs`, // 코드 하일라이팅, npm i prismjs 해야 함.
          `gatsby-remark-autolink-headers`, // 헤딩 링크 추가
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/assets/imgs/me.jpg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `whatilearncom`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-31588166-2`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                url
              }
            }
          }
        `,
        feeds: [
          {
            output: "/feed.xml",
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.fields.date,
                  url: site.siteMetadata.url + edge.node.fields.slug,
                  guid: site.siteMetadata.url + edge.node.fields.slug,
                })
              })
            },
            query: `{
              allMarkdownRemark(
                sort: { order: DESC, fields: [fields___date] },
              ) {
                edges {
                  node {
                    excerpt
                    fields {
                      slug
                      date
                    }
                    frontmatter {
                      title
                    }
                  }
                }
              }
            }
          `,
            title: "김정환 블로그 RSS Feed",
          },
        ],
      },
    },
  ],
}
