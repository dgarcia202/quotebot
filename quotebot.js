const Twit = require('twit');
const config = require('./config');
const api = require('./quoteapi');

exports.run = function() {
  console.log('robot running...');

  api.get().then(function (q) {
    console.log(`**** ${q.quote}  --${q.author}`);

    const twit = new Twit(config);
    console.log(twit);

  });
}
