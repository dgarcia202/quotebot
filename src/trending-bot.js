const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config);

function showPlaces() {
  return new Promise((resolve, reject) => {
    twit.get('trends/available',
    {
    },
    (err, data, response) => {
      if (err) {
        reject(err.message);
      } else {
        let filtered = data.filter(x => x.name == 'New York');
        resolve(filtered);
      }
    })
  });
}

module.exports.showTrends = () => {
  twit.get('trends/place',
  {
    id: 2459115
  },
  (err, data, response) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(data[0]
                    .trends
                    .filter(x => x.promoted_content == null && x.tweet_volume != null)
                    .sort((a, b) => b.tweet_volume - a.tweet_volume));
    }
  })
}


model.exports.commentTrends = () => {

}
