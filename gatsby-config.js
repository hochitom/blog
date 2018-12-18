module.exports = {
  siteMetadata: {
    title: 'hochitom.at',
    description: 'Thomas Hochörtler ist ein profesioneller Frontend-Developer aus Österreich. Auf seinem persönlichen Blog schreibt er über Themen die ihn interessieren.',
    author: '@hochitom',
    siteUrl: process.env.SITE_URL || `https://hochitom.at`
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: "gatsby-source-wordpress",
      options: {
        baseUrl: "wp.hochitom.at",
        protocol: "https",
        hostingWPCOM: false,
        perPage: 100,
        // Search and Replace Urls across WordPress content.
        searchAndReplaceContentUrls: {
          sourceUrl: "https://wp.hochitom.at",
          replacementUrl: process.env.SITE_URL || `hochitom.at`,
        },
        auth: {
          // If you use "JWT Authentication for WP REST API" (https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
          // plugin, you can specify user and password to obtain access token and use authenticated requests against wordpress REST API.
          jwt_user: 'gatsbyclient' || process.env.JWT_USER,
          jwt_pass: 'EF()!6)JPO&$J*hoMH*jqyN#' || process.env.JWT_PASSWORD,
        },
        concurrentRequests: 5,
        normalizer: function({ entities }) {
          return entities
        },
      },
    },
    // {
    //   resolve: `gatsby-source-contentful`,
    //   options: {
    //     spaceId: `gu66abr743z5`,
    //     // Learn about environment variables: https://gatsby.app/env-vars
    //     accessToken: '201a412dce3f120156326067a1a0fa3db070075b3addb4d9ac2402be910bd06b' || process.env.CONTENTFUL_ACCESS_TOKEN,
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "hochitom.at - personal Blog",
        short_name: "hochitom.at",
        start_url: "/",
        background_color: "#6b37bf",
        theme_color: "#6b37bf",
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: "standalone",
        icon: "src/images/icon.png", // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-sitemap`,
    {
      resolve: 'gatsby-plugin-matomo',
      options: {
        siteId: process.env.MATOMO_SITE_ID || 0,
        matomoUrl: process.env.MATOMO_URL || ``,
        siteUrl: process.env.SITE_URL || ``
      }
    }
  ],
}
