import { Link } from 'gatsby'
import React from 'react'

import './branding.css'

const Footer = () => (
  <div class="branding branding--inverse">
    <div className="wrapper">
      <p style={{ margin: 0 }}>made with <span role="img" aria-label="heart">❤</span>️ in Austria | Kontakt, <Link to="/impressum-datenschutzerklaerung/">Impressum &amp; Datenschutz</Link><br /><span role="img" aria-label="rocket">🚀</span>️ powered by gatsby and wordpress.</p>
    </div>
  </div>
)

export default Footer
