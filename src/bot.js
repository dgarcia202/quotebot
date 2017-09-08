const quoteBot = require('./quote-bot');
const trendingBot = require('./trending-bot');

exports.run = () => {
  console.log('robot running...');
  // quoteBot.tweetQuotes();
  trendingBot.showTrends();
  // trendingBot.showPlaces();
};

exports.shutdown = () => {
  // quoteBot.shutdown();
};
