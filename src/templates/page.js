import React, { Component } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout"
import SEO from "../components/seo"

class PostTemplate extends Component {
  render() {
    const page = this.props.data.markdownRemark

    return (
      <Layout>
        <SEO title={page.frontmatter.title} />
        <h1 dangerouslySetInnerHTML={{ __html: page.frontmatter.title }} />
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
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
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title,
      },
      html
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
