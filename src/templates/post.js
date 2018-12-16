import React, { Component } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout"
import SEO from "../components/seo"

class PostTemplate extends Component {
  render() {
    const post = this.props.data.wordpressPost
    // const post = this.props.data.contentfulArticle

    return (
      <Layout>
        <SEO title="Single Post" />
        <h1 dangerouslySetInnerHTML={{ __html: post.title }} />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </Layout>
    )
  }
}

PostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
}

export default PostTemplate

export const pageQuery = graphql`
  query($id: String!) {
    wordpressPost(id: { eq: $id }) {
      title
      content
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`

// export const pageQuery = graphql`
//   query($id: String!) {
//     contentfulArticle(id: { eq: $id }) {
//       title {
//         title
//       },
//       content {
//         content
//       }
//     }
//     site {
//       siteMetadata {
//         title
//       }
//     }
//   }
// `