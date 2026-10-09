// sortiert eine Kopie, damit die gemeinsame Collection unverändert bleibt
module.exports = function(videos) {
  return [...videos].sort((a, b) => {
    return parseFloat(b.data.viewCount) - parseFloat(a.data.viewCount)
  })
}
