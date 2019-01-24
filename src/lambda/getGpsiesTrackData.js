var rp = require('request-promise');
const xml2js = require('xml2js');
const response = require('./lib/response');
const cache = require('./lib/cache')

const gpsiesKey = process.env.GPSIESKEY || '';

const parser = new xml2js.Parser({
  explicitArray: false
});

exports.handler = function(event, context, callback) {
  const trackId = event.queryStringParameters.fieldId;
  const trackData = cache.get(trackId);

  if (trackData !== false) {
    return response(callback, trackData);
  }

  rp(`https://www.gpsies.com/api.do?key=${gpsiesKey}&fileId=${trackId}`)
    .then((res) => {
      parser.parseString(res, (err, result) => {
        console.dir(result);
        cache.add(trackId, result.gpsies.tracks);
        return response(callback, result.gpsies.tracks);
      });
    })
    .catch((err) => {
      console.error(err);
      return response(callback, err);
    });
}