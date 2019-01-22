var rp = require('request-promise');

exports.handler = function(event, context, callback) {
  const fieldId = event.queryStringParameters.fieldId;
  const A = fieldId.substr(0,1);
  const B = fieldId.substr(1,1);
  const C = fieldId.substr(2,1);

  rp(`http://www.gpsies.com/files/geojson/${A}/${B}/${C}/${fieldId}.js`)
    .then((res) => {
      callback(null, {
        'statusCode': 200,
        'headers': {
          'Content-Type': 'application/json'
        },
        'body': res
      });
    })
    .catch((err) => {
      console.error(err);
      callback(null, {
        statusCode: 503,
        body: JSON.stringify( err )
      });
    })
}