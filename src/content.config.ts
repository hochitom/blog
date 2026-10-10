import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // optionale Kennzahlen für Tour- und Rennberichte, z. B. { label: 'Distanz', value: '56 km' }
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  }),
})

// Eine Markdown-Datei pro Video, die Beschreibung steht im Textteil
const videos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/videos' }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      date: z.coerce.date(),
      viewCount: z.coerce.number(),
      thumbnail: image(),
      link: z.url(),
    }),
})

export const collections = { posts, videos }
