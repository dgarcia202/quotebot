"use strict";

const quotes = require('./quotes');
const trending = require('./trending');
const followback = require('./followback');

exports.run = () => {
  console.log('robot running...');
  
  quotes.tweetQuotes((err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.info('Quote tweeted!');
      }
  });

  // trending.tweetOnTrendingTopic();
  // followback.updateOverTime();
};

exports.shutdown = () => {
  if (quotes) {
      quotes.shutdown();
  }

  if (followback) {
      followback.shutdown();
  }

  if (trending) {
      trending.shutdown();
  }
};
