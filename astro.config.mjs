import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
import remarkBreaks from 'remark-breaks'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// https://astro.build/config
export default defineConfig({
  site: 'https://hochitom.at',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    // entspricht markdown-it mit breaks: true und #-Anker an Überschriften
    processor: unified({
      remarkPlugins: [remarkBreaks],
      rehypePlugins: [
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: { className: ['direct-link'] },
            content: { type: 'text', value: '#' },
          },
        ],
      ],
    }),
  },
  scopedStyleStrategy: 'where',
})
