var rp = require('request-promise');
const xml2js = require('xml2js');

const gpsiesKey = process.env.GPSIESKEY || '';

const parser = new xml2js.Parser({
  explicitArray: false
});

exports.handler = function(event, context, callback) {
  rp(`http://www.gpsies.com/api.do?key=${gpsiesKey}&fileId=${event.queryStringParameters.fieldId}`)
    .then((res) => {
      parser.parseString(res, (err, result) => {
        console.dir(result);
        callback(null, {
          'statusCode': 200,
          'headers': {
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify( result.gpsies.tracks || { response: 'nothing found' } )
        });
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