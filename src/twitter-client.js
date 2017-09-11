const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config.twitter);

module.exports.tweet = (status_text) => {

  return new Promise((resolve, reject) => {
    twit.post('statuses/update', {
      status: status_text
    }, (err, data, response) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(data.id_str);
      }
    });
  });
};
