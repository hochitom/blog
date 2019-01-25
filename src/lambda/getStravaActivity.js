const rp = require('request-promise');
const polyline = require('@mapbox/polyline');
const response = require('./lib/response');
const cache = require('./lib/cache');

// when api responds with authorization error
// POST https://www.strava.com/oauth/token?client_id=9587&client_secret=775dc1f20bec574b50b528f85a481c2929127ad2&code=c2cb23efa7a5b4d99fa3c1874253250e0b3ef00e&grant_type=authorization_code
// Authorization: Bearer 8223054efe95acc5e867cd2ed2e2a6039000c7d3

const accessToken = "34c98946209aa94e3465c0908732b55b858c0801";

const extractBounds = (coords) => {
  let s = 100;
  let w = 100;
  let n = 0;
  let e = 0;

  coords.forEach((c) => {
    if (s > c[1]) s = c[1];
    if (n < c[1]) n = c[1];
    if (e < c[0]) e = c[0];
    if (w > c[0]) w = c[0];
  })

  const bounds = {
    'w': w,
    's': s,
    'e': e,
    'n': n
  }

  return [w, n, e, s];
}

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
      let data = JSON.parse(res);
      data.geoJson = polyline.decode(data.map.polyline).map((latLng) => [latLng[1], latLng[0]])
      data.bounds = extractBounds(data.geoJson)
      data = JSON.stringify(data);
      cache.add(activityId, data);
      response(callback, data);
    })
    .catch((err) => {
      console.error(err);
      response(callback, err);
    });
}
