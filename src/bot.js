const quoteBot = require('./quote-bot');

exports.run = () => {
  console.log('robot running...');
  quoteBot.tweetQuotes();
}
