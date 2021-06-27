const { DateTime } = require('luxon')
const fs = require('fs')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const Image = require('@11ty/eleventy-img')

const getVideos = require('./_11ty/videos-v2')

async function imageShortcode(src, cls, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    // formats: ['avif', 'jpeg'],
    output: './img/v/',
  })

  let imageAttributes = {
    class: cls,
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  }

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes)
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addPlugin(pluginNavigation)

  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode)
  eleventyConfig.addLiquidShortcode('image', imageShortcode)
  eleventyConfig.addJavaScriptFunction('image', imageShortcode)

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')

  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj)
      .setZone('Europe/Vienna')
      .toFormat('dd. LLLL yyyy', { locale: 'de-AT' })
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj)
      .setZone('Europe/Vienna')
      .setLocale('de')
      .toFormat('yyyy-LL-dd')
  })

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })

  eleventyConfig.addCollection('tagList', require('./_11ty/getTagList'))
  eleventyConfig.addCollection('videos', require('./_11ty/videos-v2'))

  eleventyConfig.addFilter('latestVlog', require('./_11ty/latestVlog'))
  eleventyConfig.addFilter('popularVideos', require('./_11ty/popularVideos'))
  eleventyConfig.addFilter(
    'excludeHeroVideo',
    require('./_11ty/excludeHeroVideo')
  )

  eleventyConfig.addFilter('latestToOldest', function(videos) {
    return videos.sort(function(a, b) {
      return b.published - a.published // sort by date - descending
    })
  })

  eleventyConfig.addPassthroughCopy('img')
  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.addPassthroughCopy('./sw.js')

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#',
  })
  eleventyConfig.setLibrary('md', markdownLibrary)

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html')

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404)
          res.end()
        })
      },
    },
    ui: false,
    ghostMode: false,
  })

  return {
    templateFormats: ['md', 'njk', 'html', 'liquid'],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.io/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    // These are all optional, defaults are shown:
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  }
}
