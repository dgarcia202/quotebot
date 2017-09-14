"use strict";

const config = require('./config');
const twitter = require('./twitter-client');

const rita = require('rita');
const markov = new rita.RiMarkov(3);

let timeout = null;

function cleanTweet(text) {
  return text
            .replace(/^RT @\S*: /g, '')   // removes retweet mark.
            .replace(/https:\/\/t\.co\/[a-zA-Z0-9…]*/g, '')   // removes links.
            .replace(/\r?\n|\r/g, ' '); // replaces newlines by spaces.
}

module.exports.tweetOnTrendingTopic = function tweetOnTrendingTopic(callback) {
  let data = {};
  twitter.getWoeid('New York', 'United States')
  .then((woeid) => {
    return twitter.getTopTrend(woeid);
  })
  .then((trend) => {
    data.trend = trend;
    return twitter.search(data.trend);
  })
  .then((elements) => {
      markov.loadText(elements.map(x => cleanTweet(x)).join('. '));
      data.text = markov.generateSentences(5)[Math.floor(Math.random() * 5)];
      return twitter.tweet(data.text);
  })
  .then(id => {
    data.id = id;
    timeout = setTimeout(() => {
      tweetOnTrendingTopic(callback);
    }, config.trending_interval);

    if (callback) {
      callback(null, data);
    }
  })
  .catch((err) => {
    if (callback) {
      callback(err);
    }
  });
};

module.exports.isRunning = () => {
  return timeout !== null;
};

module.exports.shutdown = () => {
  if (timeout) {
    clearTimeout(timeout);
  }
};
