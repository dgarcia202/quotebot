const http = require('http');
const querystring = require('querystring');
const twitter = require('./twitter-client');
const config = require('./config');

let timeout = null;

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
};

function sanitizeString(str) {
  return str.replace('\'', '\\\'');
}

function getQuote () {
  return new Promise((resolve, reject) => {
    var req = http.request(request_options, function(res) {
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

      var buffer = '';

      res.on('data', (chunk) => {
        // console.log(`BODY: ${chunk}`);
        buffer += chunk;
      });

      res.on('end', () => {
        try {
          var response_data = JSON.parse(sanitizeString(buffer.toString()));
          resolve({
            quote: response_data.quoteText,
            author: response_data.quoteAuthor
          });
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (e) => {
      console.log('problem with request: ' + e.message);
      reject(e);
    });

    req.write(post_data);
    req.end();
  });
}

module.exports.tweetQuotes = function tweetQuotes () {
  getQuote()
  .then(q => {

    var status_text = `${q.quote} \n --${q.author}`;
    if (status_text.length > 140) {
      console.log("Quote too long, skipping.");
      return;
    }

    return twitter.tweet(status_text);
  })
  .then(id => {
    console.log(`Quote tweeted! ${id}`);
  })
  .catch(err => {
    console.log(`Quote failed due to: ${err.message}`);
  });

  timeout = setTimeout(() => {
    tweetQuotes();
  }, config.quote_interval);
};

module.exports.shutdown = () => {
  console.info('Shutting down quotes bot!');
  if (timeout) {
    clearTimeout(timeout);
  }
};
