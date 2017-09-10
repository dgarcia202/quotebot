const quotes = require('./quotes');
const trending = require('./trending');

exports.run = () => {
  console.log('robot running...');
  // quotes.tweetQuotes();
  trending.tweetOnTrendingTopic();
  // trendingBot.showPlaces();
};

exports.shutdown = () => {
  // quotes.shutdown();
};
