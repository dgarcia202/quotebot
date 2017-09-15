'use strict';

const quotes = require('./quotes');
const trending = require('./trending');
const followback = require('./followback');

exports.run = () => {
  // console.info('robot running...');

  quotes.tweetQuotes((err) => {
    if (err) {
      // console.error(err);
    } else {
      // console.info(`Quote tweeted! (id: ${data})`);
    }
  });

  trending.tweetOnTrendingTopic((err) => {
    if (err) {
      // console.error(err);
    } else {
      // console.info(`Tweet on trending topic ${data.query} (id: ${data.id}))`);
    }
  });

  followback.updateOverTime((err) => {
    if (err) {
      // console.error(err);
    } else {
      // console.info(`Followed ${data.length} new users`);
    }
  });
};

exports.shutdown = () => {
  // console.info('robot shutting down...');

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
