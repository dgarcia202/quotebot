"use strict";

const rita = require('rita');
const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config.twitter);
const markov = new rita.RiMarkov(3);

let corpus = {
  data: []
};

function cleanTweet(text) {
  return text
            .replace(/^RT @\S*: /g, '')   // removes retweet mark.
            .replace(/https:\/\/t\.co\/[a-zA-Z0-9…]*/g, '')   // removes links.
            .replace(/\r?\n|\r/g, ' '); // replaces newlines by spaces.
}

function getWoeid() {
  return new Promise((resolve, reject) => {
    twit.get('trends/available',
    {
    },
    (err, data, response) => {
      if (err) {
        reject(err.message);
      } else {
        let filtered = data.filter(x => x.name == 'New York' && x.country == 'United States');
        if (filtered.length == 0) {
          reject('New york in the US not found as a trending place available');
        } else {
          resolve(filtered[0].woeid);
        }
      }
    })
  });
}

function getTrend(woeid) {
  return new Promise((resolve, reject) => {
    twit.get('trends/place',
    {
      id: woeid
    },
    (err, data, response) => {
      if (err) {
        reject(err);
      } else {
        var trends = data[0]
                .trends
                .filter(x => x.promoted_content == null && x.tweet_volume != null)
                .sort((a, b) => b.tweet_volume - a.tweet_volume);

        if (trends.length == 0) {
          reject(new Error('No valid trends found in the specified location'));
        } else {
          console.log(`choosed trend ${trends[0].query}`);
          resolve(trends[0].query);
        }
      }
    });
  });
}

function buildCorpus(trend) {
  return new Promise((resolve, reject) => {
    twit.get('search/tweets', {
      q: trend,
      count: 100,
      lang: 'en',
      // geocode: '41.3087608,-72.9272461,1000mi'
    }, (err, data, response) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Total of ${data.statuses.length} tweets retrieved.`)
        corpus.data = data.statuses.map((x) => cleanTweet(x.text));
        resolve(corpus);
      }
    });
  });
}

module.exports.tweetOnTrendingTopic = () => {
  getWoeid()
  .then((woeid) => {
    return getTrend(woeid);
  })
  .then((trend) => {
    return buildCorpus(trend);
  })
  .then((corpus) => {
    markov.loadText(corpus);
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
