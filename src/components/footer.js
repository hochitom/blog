import { Link } from 'gatsby'
import React from 'react'

const Footer = () => (
  <div
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
    }}
  >
    <p><span role="img" aria-label="todo">👨🏽‍💻</span> <Link to="/ueber-mich/">Thomas Hochörtler</Link> ist ein Frontend-Developer aus Leidenschaft.</p>
    <p>made with <span role="img" aria-label="todo">❤</span>️ in Austria | Kontakt, Impressum, Datenschutz</p>
  </div>
)

export default Footer
