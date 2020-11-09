const http = require('https')
// const parseString = require('xml2js').parseString

const fetchFeed = function () {
  console.log('fetchFeed')
  return new Promise((resolve, reject) => {
    http
      .get(
        'https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCxpmQStO4F1ycGde21DXolg&maxResults=50&key=AIzaSyD_TpAOELAzJP-2cRSkSU5qOItsb8ETrpc'
      )
      .on('response', function (response) {
        let string = ''

        response.on('data', function (chunk) {
          string += chunk
        })

        response.on('end', function () {
          resolve(string)
        })

        response.on('error', function () {
          reject()
        })
      })
  })
}

const parseFeedAndNormalizeData = function (feedAsString) {
  const feed = JSON.parse(feedAsString)

  return feed.items
    .filter((r) => r.id.kind === 'youtube#video')
    .sort(
      (a, b) =>
        new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
    )
    .map((item) => {
      return {
        id: item.id.videoId,
        channelId: item.snippet.channelId,
        title: item.snippet.title,
        link: `https://youtube.com/watch?v=${item.id.videoId}`,
        published: new Date(item.snippet.publishedAt),
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails,
      }
      //           author: item.author[0]['name'][0],
      //           profileLink: item.author[0]['uri'][0],
      //           updated: new Date(item.updated[0]),
      //           content: media['media:content'][0]['$'],
      //           media: media,
    })

  //   if (result && result.feed && result.feed.entry) {
  //     const normalizedData = result.feed.entry
  //       .map((item) => {
  //         const media = item['media:group'][0]
  //         return {
  //           id: item['yt:videoId'][0],
  //           channelId: item['yt:channelId'][0],
  //           title: item.title[0],
  //           link: item.link[0]['$']['href'],
  //           author: item.author[0]['name'][0],
  //           profileLink: item.author[0]['uri'][0],
  //           published: new Date(item.published[0]),
  //           updated: new Date(item.updated[0]),
  //           description: media['media:description'][0],
  //           content: media['media:content'][0]['$'],
  //           thumbnail: media['media:thumbnail'][0]['$'],
  //           media: media,
  //         }
  //       })
  //       .sort((a, b) => a.published > b.published)
  //     return resolve(normalizedData)
  //   }
}

const t = async function () {
  const feed = await fetchFeed()
  const videos = parseFeedAndNormalizeData(feed)
  return videos
}

t()

module.exports = t
