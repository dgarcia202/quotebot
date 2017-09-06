const config = require('./config');
const Twit = require('twit');
const api = require('./quoteapi');

function tweetQuote() {
  api.get().then((q) => {
    const twit = new Twit(config);
    twit.post('statuses/update', {
      status:`${q.quote} \n\n --${q.author}`
    }, (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${data.text} tweeted!`)
      }
    })
  });
}

exports.run = () => {
  console.log('robot running...');
  tweetQuote();
}
