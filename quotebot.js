const config = require('./config');
const Twit = require('twit');
const api = require('./quoteapi');

exports.run = () => {
  console.log('robot running...');

  api.get().then((q) => {
    console.log(`**** ${q.quote}  --${q.author}`);

    const twit = new Twit(config);
    twit.get('statuses/user_timeline', {
      count: 10
    }, (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        data.forEach(x => {
          console.log(x.text);
        });
      }
    })
  });
}
