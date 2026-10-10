import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { render } from 'astro:content'
import { getPosts } from '../../lib/content'
import { site } from '../../lib/site'

export async function GET(context: APIContext) {
  const container = await AstroContainer.create()
  const posts = await getPosts()
  const origin = context.site!.origin

  const items = await Promise.all(
    posts.map(async post => {
      const { Content } = await render(post)
      const html = await container.renderToString(Content)
      return {
        title: post.data.title,
        pubDate: post.data.date,
        link: `/posts/${post.id}/`,
        // relative Pfade im Volltext absolut machen, damit Reader Bilder finden
        content: html.replace(/(src|href)="\//g, `$1="${origin}/`),
      }
    })
  )

  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items,
    customData: '<language>de-at</language>',
  })
}
