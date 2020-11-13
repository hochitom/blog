const http = require('https')
const slugify = require('slugify')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const youtubeKey = process.env.youtube_api || ''
const mongoUser = process.env.mongo_user || ''
const mongoPw = process.env.mongo_pw || ''

slugify.extend({ '|': '' })
slugify.extend({ ü: 'ue' })
slugify.extend({ ö: 'oe' })
slugify.extend({ ä: 'ae' })
slugify.extend({ ß: 'ss' })

const youtubeUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCxpmQStO4F1ycGde21DXolg&maxResults=100&key=${youtubeKey}`
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPw}@main.aiphv.mongodb.net/blog?retryWrites=true&w=majority`

const Schema = mongoose.Schema

const Permalink = new Schema({
  yid: { type: String, index: true },
  permalink: String,
  createdAt: { type: Date, default: Date.now },
})

const connectDb = async () => {
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
}

const fetchFeed = function() {
  return new Promise((resolve, reject) => {
    http.get(youtubeUrl).on('response', function(response) {
      let string = ''

      response.on('data', function(chunk) {
        string += chunk
      })

      response.on('end', function() {
        resolve(string)
      })

      response.on('error', function() {
        reject()
      })
    })
  })
}

const createPermalink = string => {
  return slugify(string.split('|')[0], {
    strict: true,
    lower: true,
  })
}

const getPermalinkFromDb = (model, id) => {
  return model.findOne({ yid: id })
}

const saverPermalinkToDb = async (model, id, permalink) => {
  return model.create({ yid: id, permalink })
}

const getPermalink = async (id, title, model) => {
  const permalink = await getPermalinkFromDb(model, id)

  if (permalink) {
    return permalink.permalink
  }

  const newPermalink = createPermalink(title)
  await saverPermalinkToDb(model, id, newPermalink)

  return newPermalink
}

const getSortedVideos = items => {
  return items
    .filter(r => r && r.id && r.id.kind === 'youtube#video')
    .sort(
      (a, b) =>
        new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
    )
    .map(item => {
      return {
        id: item.id.videoId,
        channelId: item.snippet.channelId,
        title: item.snippet.title,
        link: `https://youtube.com/watch?v=${item.id.videoId}`,
        published: new Date(item.snippet.publishedAt),
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails,
      }
    })
}

const parseFeedAndNormalizeData = async (feedAsString, model) => {
  const feed = JSON.parse(feedAsString)

  if (!feed || !feed.items) {
    return []
  }

  const videos = getSortedVideos(feed.items)

  for (let i = 0; i < videos.length; i++) {
    const permalink = await getPermalink(videos[i].id, videos[i].title, model)
    videos[i].permalink = permalink
  }

  return videos
}

const t = async () => {
  const db = await connectDb()
  const MyModel = db.model('Permalink', Permalink)
  const feed = await fetchFeed()
  const videos = await parseFeedAndNormalizeData(feed, MyModel)
  mongoose.connection.close()
  return videos
}

// t()

module.exports = t
