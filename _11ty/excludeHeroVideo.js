module.exports = function(videos, excludedVideo) {
  console.log('excludedVideo', excludedVideo)
  return videos.filter(v => v.id !== excludedVideo)
}
