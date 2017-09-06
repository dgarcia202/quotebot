const Twit = require('twit');

const config = require('./config');
const quotes = require('./quotes');

const twit = new Twit(config);

function tweetQuote() {
  quotes.get().then((q) => {

    var status_text = `${q.quote} \n --${q.author}`;
    if (status_text.length > 140) {
      console.log("Quote too long, skipping.");
      return;
    }

    twit.post('statuses/update', {
      status: status_text
    }, (err, data, response) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log('Quote tweeted!');
      }
    })
  });

  setTimeout(() => {
    tweetQuote();
  }, config.quote_interval);
}

exports.run = () => {
  console.log('robot running...');
  tweetQuote();
}
