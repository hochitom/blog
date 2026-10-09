/*
 * Einmaliger Export aller YouTube-Videos als statische Dateien.
 *
 * Schreibt je Video eine Markdown-Datei nach videos/<permalink>.md (Metadaten als
 * Front Matter, Beschreibung als Text) und das Vorschaubild nach img/videos/<id>.jpg.
 *
 * Benötigt eine .env (oder Umgebungsvariablen):
 *   youtube_api   API-Schlüssel der YouTube Data API
 *   mongo_user    Benutzer der MongoDB mit den bisherigen Permalinks
 *   mongo_pw      Passwort der MongoDB
 *
 * Aufruf:  node scripts/export-videos.js [--no-db] [--out <ordner>]
 *   --no-db   Permalinks nicht aus der MongoDB lesen, sondern aus dem Titel erzeugen
 *             (die URLs können dann von den bisherigen abweichen)
 *   --out     Zielordner für die Markdown-Dateien (Standard: videos)
 *
 * Zum Testen: YOUTUBE_API_BASE überschreibt die Adresse der YouTube-API.
 */
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const slugify = require('slugify')

dotenv.config()

const CHANNEL_ID = 'UCxpmQStO4F1ycGde21DXolg'
const API_BASE =
  process.env.YOUTUBE_API_BASE || 'https://www.googleapis.com/youtube/v3'
const youtubeKey = process.env.youtube_api || ''

const args = process.argv.slice(2)
const useDb = !args.includes('--no-db')
const outIndex = args.indexOf('--out')
const outDir = path.resolve(outIndex >= 0 ? args[outIndex + 1] : 'videos')
const imgDir = path.resolve('img/videos')

slugify.extend({ '|': '' })
slugify.extend({ ü: 'ue' })
slugify.extend({ ö: 'oe' })
slugify.extend({ ä: 'ae' })
slugify.extend({ ß: 'ss' })

const createPermalink = title =>
  slugify(title.split('|')[0], { strict: true, lower: true })

const getJson = async url => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url.split('?')[0]}`)
  }
  return response.json()
}

// Alle Video-IDs des Kanals, neueste zuerst (die API liefert max. 50 pro Seite).
const fetchVideoIds = async () => {
  const ids = []
  let pageToken = ''
  do {
    const url =
      `${API_BASE}/search?part=snippet&channelId=${CHANNEL_ID}&type=video` +
      `&order=date&maxResults=50&key=${youtubeKey}` +
      (pageToken ? `&pageToken=${pageToken}` : '')
    const page = await getJson(url)
    for (const item of page.items || []) {
      if (item.id && item.id.videoId) ids.push(item.id.videoId)
    }
    pageToken = page.nextPageToken || ''
  } while (pageToken)
  return ids
}

const fetchDetails = async ids => {
  const details = []
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50)
    const url =
      `${API_BASE}/videos?part=snippet,statistics&id=${batch.join(',')}` +
      `&maxResults=50&key=${youtubeKey}`
    const result = await getJson(url)
    details.push(...(result.items || []))
  }
  return details
}

// Bisherige Permalinks aus der MongoDB (Sammlung "permalinks": { yid, permalink }).
const fetchPermalinks = async () => {
  const mongoose = require('mongoose')
  const url = `mongodb+srv://${process.env.mongo_user || ''}:${process.env.mongo_pw ||
    ''}@main.aiphv.mongodb.net/blog?retryWrites=true&w=majority`
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  const Permalink = mongoose.model(
    'Permalink',
    new mongoose.Schema({ yid: String, permalink: String })
  )
  const rows = await Permalink.find({}).lean()
  await mongoose.connection.close()
  return new Map(rows.map(row => [row.yid, row.permalink]))
}

const downloadFile = async (url, file) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`${response.status}: ${url}`)
  fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()))
}

const toMarkdown = (video, permalink) => {
  const lines = [
    '---',
    'layout: layouts/video.njk',
    `id: ${JSON.stringify(video.id)}`,
    `title: ${JSON.stringify(video.title)}`,
    `date: ${video.publishedAt}`,
    `permalink: ${JSON.stringify(`/videos/${permalink}/`)}`,
    `viewCount: ${video.viewCount}`,
    `thumbnail: ${JSON.stringify(`img/videos/${video.id}.jpg`)}`,
    `link: ${JSON.stringify(`https://youtube.com/watch?v=${video.id}`)}`,
    '---',
    '',
    video.description.trim(),
    '',
  ]
  return lines.join('\n')
}

const main = async () => {
  if (!youtubeKey) throw new Error('youtube_api ist nicht gesetzt (.env prüfen)')

  console.log('Lade Videoliste von YouTube ...')
  const ids = await fetchVideoIds()
  const details = await fetchDetails(ids)
  const videos = details
    .filter(item => item.snippet.liveBroadcastContent !== 'upcoming')
    .map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description || '',
      publishedAt: new Date(item.snippet.publishedAt).toISOString(),
      viewCount: Number(item.statistics && item.statistics.viewCount) || 0,
      thumbnail:
        (item.snippet.thumbnails.medium || item.snippet.thumbnails.default).url,
    }))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  console.log(`${videos.length} Videos gefunden.`)

  const stored = useDb ? await fetchPermalinks() : new Map()
  if (useDb) console.log(`${stored.size} Permalinks aus der MongoDB gelesen.`)

  fs.mkdirSync(outDir, { recursive: true })
  fs.mkdirSync(imgDir, { recursive: true })

  const used = new Set()
  let fromDb = 0
  for (const video of videos) {
    let permalink = stored.get(video.id)
    if (permalink) fromDb++
    else permalink = createPermalink(video.title)
    if (used.has(permalink)) permalink = `${permalink}-${video.id.toLowerCase()}`
    used.add(permalink)

    fs.writeFileSync(path.join(outDir, `${permalink}.md`), toMarkdown(video, permalink))
    await downloadFile(video.thumbnail, path.join(imgDir, `${video.id}.jpg`))
    console.log(`  ${video.publishedAt.slice(0, 10)}  ${permalink}`)
  }

  console.log(
    `\nFertig: ${videos.length} Dateien in ${path.relative('.', outDir) || '.'}/` +
      ` und img/videos/. Permalinks aus der Datenbank: ${fromDb}, neu erzeugt: ${videos.length -
        fromDb}.`
  )
  if (useDb && videos.length - fromDb > 0) {
    console.log('Hinweis: Für neu erzeugte Permalinks gab es keinen Datenbankeintrag.')
  }
}

main().catch(error => {
  console.error('Export fehlgeschlagen:', error.message)
  process.exit(1)
})
