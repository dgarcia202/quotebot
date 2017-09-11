"use strict";

const quotes = require('./quotes');
const trending = require('./trending');
const followback = require('./followback');

exports.run = () => {
  console.log('robot running...');
  // quotes.tweetQuotes();
  // trending.tweetOnTrendingTopic();
  followback.update();
};

exports.shutdown = () => {
  // quotes.shutdown();
};
