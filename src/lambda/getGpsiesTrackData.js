var rp = require('request-promise');
const xml2js = require('xml2js');

const gpsiesKey = process.env.GPSIESKEY || '';

const parser = new xml2js.Parser({
  explicitArray: false
});

let dumbCache = {};

const addToCache = (key, data) => {
  data.cacheHit = true;
  dumbCache[key] = data;
}

const getFromCache = (key) => {
  if (dumbCache[key] !== undefined) {
    return dumbCache[key];
  } else {
    return false;
  }
}

const response = (callback, data) => {
  if (data === undefined) data = '{ response: "nothing found" }';
  return callback(null, {
    'statusCode': 200,
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': typeof data === 'string' ? data : JSON.stringify( data )
  });
}

exports.handler = function(event, context, callback) {
  const trackId = event.queryStringParameters.fieldId;
  const trackData = getFromCache(trackId);

  if (trackData !== false) {
    return response(callback, trackData);
  }

  rp(`https://www.gpsies.com/api.do?key=${gpsiesKey}&fileId=${trackId}`)
    .then((res) => {
      parser.parseString(res, (err, result) => {
        console.dir(result);
        addToCache(trackId, result.gpsies.tracks);
        return response(callback, result.gpsies.tracks);
      });
    })
    .catch((err) => {
      console.error(err);
      return response(callback, err);
    });
}