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
