require('dotenv').config();

function hours(num) {
  return 3600000 * num;
}

function minutes(num) {
  return 60000 * num;
}

module.exports = {
  twitter: {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  },
  start_http: false,
  quote_interval: hours(10),
  followback_interval: minutes(15),
  trending_interval: hours(2),
  screen_name: 'sillyrobot14'
}
