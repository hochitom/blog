import { getCollection } from 'astro:content'

// Artikel, neueste zuerst
export async function getPosts() {
  const posts = await getCollection('posts')
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

// Videos, neueste zuerst
export async function getVideos() {
  const videos = await getCollection('videos')
  return videos.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

// alle verwendeten Tags, in der Reihenfolge ihres ersten Auftretens
export async function getTagList() {
  const posts = await getPosts()
  return [...new Set(posts.flatMap(post => post.data.tags))]
}

// Kurzer Textauszug aus dem Markdown eines Artikels: erster Absatz ohne Bilder, Links und HTML
export function excerpt(markdown: string, maxLength = 220) {
  const clean = (block: string) =>
    block
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

  const text = markdown
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .filter(block => !/^(<|#|[-*>]|\d+\.)/.test(block))
    .map(clean)
    .find(block => block.length > 0)
  if (!text) return ''

  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + ' …'
}

// die meistgenutzten Tags samt Artikelanzahl
export async function getTopTags(limit = 4) {
  const posts = await getPosts()
  const counts = new Map<string, number>()
  for (const tag of posts.flatMap(post => post.data.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}
