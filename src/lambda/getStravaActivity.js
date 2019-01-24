const rp = require('request-promise');
const response = require('./lib/response');
const cache = require('./lib/cache');

const accessToken = "63397d5e9040aa2fc00140f5de2e39fa01f2b2cf";

exports.handler = (event, context, callback) => {
  const activityId = event.queryStringParameters.id;
  const trackData = cache.get(activityId);

  if (trackData !== false) {
    return response(callback, trackData);
  }

  rp
    .get(`https://www.strava.com/api/v3/activities/${activityId}?include_all_efforts=false`, {
      'auth': {
        'bearer': accessToken
      }
    })
    .then((res) => {
      console.dir(res);
      cache.add(activityId, res);
      response(callback, res);
    })
    .catch((err) => {
      console.error(err);
      response(callback, err);
    });
}
