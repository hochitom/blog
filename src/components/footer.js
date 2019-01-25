import { Link } from 'gatsby'
import React from 'react'

import './branding.css'

const Footer = () => (
  <div className="branding branding--inverse">
    <div className="wrapper">
      <p style={{ margin: 0 }}>made with <span role="img" aria-label="heart">❤️</span>️ in Austria | Kontakt, <Link to="/impressum-datenschutzerklaerung/">Impressum &amp; Datenschutz</Link><br /><span role="img" aria-label="rocket">🚀</span>️ powered by <a href="https://www.gatsbyjs.org/" rel="nofollow">gatsby</a> and <a href="https://wordpress.org/" rel="nofollow">wordpress</a>.</p>
    </div>
  </div>
)

export default Footer
