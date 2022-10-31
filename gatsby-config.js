module.exports = {
  siteMetadata: {
    title: `김정환 블로그`,
    description: `주로 웹 기술에 대해 이야기 합니다`,
    author: `김정환`,
    url: "https://jeonghwan-kim.github.io",
    social: {
      githubUsername: "jeonghwan-kim",
    },
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`, // file.sourceInstanceName
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
              showCaptions: true,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`, // 헤딩 링크 추가. presimjs 앞에 와야함(https://github.com/gatsbyjs/gatsby/issues/5764)
            options: {
              icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`, // 코드 하일라이팅, npm i prismjs 해야 함.
            options: {
              showLineNumbers: false,
              noInlineHighlight: true,
            },
          },
        ],
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `김정환 블로그`,
        short_name: `김정환블로그`,
        start_url: `/`,
        background_color: `#cd5554`,
        theme_color: `#cd5554`,
        display: `minimal-ui`,
        icon: `static/assets/imgs/me.jpg`, // This path is relative to the root of the site.
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
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.url + edge.node.frontmatter.slug,
                  guid: site.siteMetadata.url + edge.node.frontmatter.slug,
                })
              })
            },
            query: `{
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    excerpt
                    frontmatter {
                      slug
                      date
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
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-graphql-codegen`,
  ],
}
