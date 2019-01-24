const rp = require('request-promise');
const response = require('./lib/response');
const cache = require('./lib/cache');

// when api responds with authorization error
// POST https://www.strava.com/oauth/token?client_id=9587&client_secret=775dc1f20bec574b50b528f85a481c2929127ad2&code=c2cb23efa7a5b4d99fa3c1874253250e0b3ef00e&grant_type=authorization_code
// Authorization: Bearer 8223054efe95acc5e867cd2ed2e2a6039000c7d3

const accessToken = "aa65aaee584247b6e4ac9c066cc79320e96ab6e4";

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
