"use strict";

const config = require('./config');
const twitter = require('./twitter-client');

const rita = require('rita');
const markov = new rita.RiMarkov(3);

function cleanTweet(text) {
  return text
            .replace(/^RT @\S*: /g, '')   // removes retweet mark.
            .replace(/https:\/\/t\.co\/[a-zA-Z0-9…]*/g, '')   // removes links.
            .replace(/\r?\n|\r/g, ' '); // replaces newlines by spaces.
}

module.exports.tweetOnTrendingTopic = () => {
  twitter.getWoeid('New York', 'United States')
  .then((woeid) => {
    return twitter.getTopTrend(woeid);
  })
  .then((trend) => {
    return twitter.search(trend);
  })
  .then((elements) => {
    markov.loadText(elements.map(x => cleanTweet(x)).join('. '));
    console.log(markov.generateSentences(5));
  })
  .catch((err) => {
    console.error(err);
  });
};

module.exports.shutdown = () => {
  console.info('Shutting down trending bot!');
  // Nothing to do yet.
};
