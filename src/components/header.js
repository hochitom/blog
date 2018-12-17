import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

import './branding.css'

const Header = ({ siteTitle }) => (
  <div class="branding">
    <div class="wrapper">
      <h1 class="branding__title">
        <Link to="/">
          {siteTitle}
        </Link>
      </h1>
      <p>Hi <span role="img" aria-label="waving hand">👋🏼</span> I'm Thomas, a self-taught Frontend Developer from Austria<span role="img" aria-label="austrian flag">🇦🇹</span>. This is my blog where i write mostly in german <span role="img" aria-label="german flag">🇩🇪</span> about topics I'm interested in.</p>
    </div>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: '',
}

export default Header
