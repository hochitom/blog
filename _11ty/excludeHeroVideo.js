module.exports = function(videos, excludedVideo) {
  return videos.filter(v => v.data.id !== excludedVideo)
}
