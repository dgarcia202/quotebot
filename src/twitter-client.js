const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config.twitter);
