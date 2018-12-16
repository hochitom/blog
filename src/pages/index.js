import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

import { rhythm } from '../utils/typography'

class Home extends Component {
  render() {
    const posts = this.props.data.allWordpressPost
    // const posts = this.props.data.allContentfulArticle

    return(
      <Layout>
        <SEO title="Home" keywords={['gatsby', 'application', 'react']} />
        <h1>Hi people</h1>
        <p>Welcome to your new Gatsby site.</p>
        <p>Now go build something great.</p>
        <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
          <Image />
        </div>
    
        <h1>Posts</h1>
        <ul>
          {posts.edges.map(({ node }) => (
            <li>
              <h3>
                <Link to={node.slug}>
                  {node.title}
                </Link>
              </h3>
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
    allWordpressPost(sort: { fields: [date] }) {
      edges {
        node {
          title
          excerpt
          slug
        }
      }
    }
  }
`

// export const pageQuery = graphql`
//   query {
//     allContentfulArticle(limit: 100) {
//       edges {
//         node {
//           id,
//           title {
//             title
//           }
//         }
//       }
//     }
//   }
// `
