const http = require('https')
const parseString = require('xml2js').parseString

const fetchFeed = function () {
  return new Promise((resolve, reject) => {
    http
      .get(
        'https://www.youtube.com/feeds/videos.xml?channel_id=UCxpmQStO4F1ycGde21DXolg'
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
  return new Promise((resolve, reject) => {
    parseString(feedAsString, function (err, result) {
      if (err) {
        return reject()
      }

      if (result && result.feed && result.feed.entry) {
        const normalizedData = result.feed.entry
          .map((item) => {
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
          .sort((a, b) => a.created > b.created)
        return resolve(normalizedData)
      }

      return reject()
    })
  })
}

module.exports = async function () {
  const feed = await fetchFeed()
  const videos = await parseFeedAndNormalizeData(feed)
  return videos
}
