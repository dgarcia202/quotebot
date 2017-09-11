"use strict";

const quotes = require('./quotes');
const trending = require('./trending');
const followback = require('./followback');

exports.run = () => {
  console.log('robot running...');
  // quotes.tweetQuotes();
  trending.tweetOnTrendingTopic();
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
