import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

class Home extends Component {
  render() {
    const posts = this.props.data.allWordpressPost

    return(
      <Layout>
        <SEO title="Home" keywords={['gatsby', 'application', 'react']} />

        <h1>Posts</h1>
        <ul>
          {posts.edges.map(({ node }) => (
            <li>
              <Link to={node.slug}>
                <span dangerouslySetInnerHTML={{ __html: node.title }} />
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
    allWordpressPost(sort: { fields: [date], order: DESC }) {
      edges {
        node {
          title
          excerpt
          slug
          date
        }
      }
    }
  }
`
