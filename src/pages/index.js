import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

class Home extends Component {
  render() {
    const posts = this.props.data.allMarkdownRemark

    return(
      <Layout>
        <SEO title="Home" keywords={['gatsby', 'application', 'react']} />

        <h1>Posts</h1>
        <ul>
          {posts.edges.map(({ node }) => (
            <li>
              <Link to={node.fields.slug}>
                <span dangerouslySetInnerHTML={{ __html: node.frontmatter.title }} />
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    )
  }
}

export default Home

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC },
      filter: { frontmatter: { layout: { eq:"post"} } }
    ) {
      edges {
        node {
          id,
          fields {
            slug
          },
          frontmatter {
            title,
            date,
          }
        }
      }
    }
  }
`
