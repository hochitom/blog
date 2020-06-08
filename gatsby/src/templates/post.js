import React, { Component } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout"
import SEO from "../components/seo"

import rehypeReact from "rehype-react"
import Map from "../components/map"

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { "map": Map },
}).Compiler

class PostTemplate extends Component {
  render() {
    const post = this.props.data.markdownRemark

    return (
      <Layout>
        <SEO title={post.frontmatter.title} />
        <h1 dangerouslySetInnerHTML={{ __html: post.frontmatter.title }} />
        {/* <div dangerouslySetInnerHTML={{ __html: post.html }} /> */}
        {
          renderAst(post.htmlAst)
        }
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
        date,
      },
      html,
      htmlAst
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
