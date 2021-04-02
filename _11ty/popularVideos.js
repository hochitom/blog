module.exports = function(videos) {
  return videos.sort((a, b) => {
    return parseFloat(b.viewCount) - parseFloat(a.viewCount)
  })
}
