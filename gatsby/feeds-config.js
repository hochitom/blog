module.exports = [
  {
    serialize: ({ query: { site, allMarkdownRemark } }) => {
      return allMarkdownRemark.edges.map(edge => {
        return Object.assign({}, edge.node.frontmatter, {
          description: edge.node.excerpt,
          date: edge.node.frontmatter.date,
          url: site.siteMetadata.siteUrl + edge.node.fields.slug,
          guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
          custom_elements: [{ "content:encoded": edge.node.html }],
        })
      })
    },
    query: `
      {
        allMarkdownRemark(
          limit: 1000,
          sort: { fields: [frontmatter___date], order: DESC },
          filter: {
            frontmatter: {
              status: { ne:"draft"},
              layout: { eq:"post"}
            }
          }
        ) {
          edges {
            node {
              html
              fields { slug }
              frontmatter {
                title
                date
              }
            }
          }
        }
      }
    `,
    output: "/rss.xml",
    title: "Hochitom.at RSS Feed",
  }
]