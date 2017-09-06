const http = require('http');
const querystring = require('querystring');

const post_data = querystring.stringify({
  method: 'getQuote',
  format: 'json',
  key: '5126296161',
  lang: 'en'
});

const request_options = {
  hostname: 'api.forismatic.com',
  port: 80,
  path: '/api/1.0/',
  method: 'POST',
  headers:{
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(post_data)
  }
}

function sanitizeString(str) {
  return str
          .replace('\'', '\\\'');
          // .replace('"', '\\"');
}

exports.get = function () {
  return new Promise(function (resolve, reject) {
    var req = http.request(request_options, function(res) {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

      var buffer = '';

      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
        buffer += chunk;
      });

      res.on('end', () => {
        var response_data = JSON.parse(sanitizeString(buffer.toString()));
        resolve({
          quote: response_data.quoteText,
          author: response_data.quoteAuthor
        });
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      reject(e.message);
    });

    req.write(post_data);
    req.end();
  });
}
