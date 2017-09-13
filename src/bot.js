"use strict";

const quotes = require('./quotes');
const trending = require('./trending');
const followback = require('./followback');

exports.run = () => {
  console.info('robot running...');

  quotes.tweetQuotes((err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`Quote tweeted! (id: ${data})`);
    }
  });

  // trending.tweetOnTrendingTopic();

  followback.updateOverTime((err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`Followed ${data.length} new users`);
    }
  });
};

exports.shutdown = () => {
  console.info('robot shutting down...');
  
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
