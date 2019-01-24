module.exports = (callback, data) => {
  if (data === undefined) data = '{ response: "nothing found" }';
  return callback(null, {
    'statusCode': 200,
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': typeof data === 'string' ? data : JSON.stringify( data )
  });
};