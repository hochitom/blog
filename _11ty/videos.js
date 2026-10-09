import EleventyFetch from '@11ty/eleventy-fetch'
import xml2js from 'xml2js'

const parseString = xml2js.parseString

const FEED_URL =
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCxpmQStO4F1ycGde21DXolg'

// Cached für 1 Tag. Bei Netzwerkfehlern nutzt eleventy-fetch den letzten
// gespeicherten Stand (.cache), ohne Cache bleibt die Videoliste leer.
const fetchFeed = function() {
  return EleventyFetch(FEED_URL, {
    duration: '1d',
    type: 'text',
    fetchOptions: { signal: AbortSignal.timeout(10000) },
  })
}

const parseFeedAndNormalizeData = function(feedAsString) {
  return new Promise((resolve, reject) => {
    parseString(feedAsString, function(err, result) {
      if (err) {
        return reject()
      }

      if (result && result.feed && result.feed.entry) {
        const normalizedData = result.feed.entry
          .map(item => {
            const media = item['media:group'][0]
            return {
              id: item['yt:videoId'][0],
              channelId: item['yt:channelId'][0],
              title: item.title[0],
              link: item.link[0]['$']['href'],
              author: item.author[0]['name'][0],
              profileLink: item.author[0]['uri'][0],
              published: new Date(item.published[0]),
              updated: new Date(item.updated[0]),
              description: media['media:description'][0],
              content: media['media:content'][0]['$'],
              thumbnail: media['media:thumbnail'][0]['$'],
              media: media,
            }
          })
          .sort((a, b) => b.published - a.published)
        return resolve(normalizedData)
      }

      return reject()
    })
  })
}

export default async function() {
  try {
    const feed = await fetchFeed()
    return await parseFeedAndNormalizeData(feed)
  } catch (e) {
    console.warn('[videos] YouTube-Feed nicht verfügbar, Videoliste bleibt leer.', e && e.message)
    return []
  }
}
