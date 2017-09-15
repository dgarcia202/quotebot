'use strict';

const proxyquire = require('proxyquire');
const assert = require('chai').assert;
const sinon = require('sinon');

let twitterStub = require('../src/twitter-client');
let ritaStub = require('rita');
let sut = proxyquire('../src/trending', {
  'rita': ritaStub,
  './twitter-client': twitterStub
});

describe('Trending bot', () => {
  beforeEach(() => {
    sinon.stub(twitterStub, 'tweet').resolves('fake_tweet_id');
    sinon.stub(twitterStub, 'getWoeid').resolves('fake_woeid');
    sinon.stub(twitterStub, 'getTopTrend').resolves('some_topic');
    sinon.stub(twitterStub, 'search').resolves(['tweet A', 'tweet B', 'tweet C']);
    sinon.stub(ritaStub.RiMarkov.prototype, 'loadText');
    sinon.stub(ritaStub.RiMarkov.prototype, 'generateSentences').returns(['', '', '', '', '']);
  });

  afterEach(() => {
    twitterStub.tweet.restore();
    twitterStub.getWoeid.restore();
    twitterStub.getTopTrend.restore();
    twitterStub.search.restore();
    ritaStub.RiMarkov.prototype.loadText.restore();
    ritaStub.RiMarkov.prototype.generateSentences.restore();
  });

  it('tweets on the top trending', done => {
    sut.tweetOnTrendingTopic((err) => {
      assert.isNotOk(err, 'Unexpected error happened');
      assert.isTrue(twitterStub.tweet.calledOnce, 'Nothing was twitted');
      sut.shutdown();
      done();
    });
  });

  it('choses the top topic of the list', done => {
    sut.tweetOnTrendingTopic((err, data) => {
      assert.isNotOk(err, 'Unexpected error happened');
      assert.equal(data.trend, 'some_topic', 'Trend query is missed in results');
      sut.shutdown();
      done();
    });
  });

  it('handles twitter client error', () => {
    return new Promise((resolve, reject) => {
      twitterStub.tweet.rejects();
      twitterStub.getWoeid.rejects();
      twitterStub.getTopTrend.rejects();
      twitterStub.search.rejects();

      sut.tweetOnTrendingTopic((err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    }).then(() => {
      assert.isNotTrue(twitterStub.tweet.called, 'Nothing should be twitted');
      sut.shutdown();
    });
  });

  it('keeps running after an iteration', () => {
    return new Promise((resolve, reject) => {
      sut.tweetOnTrendingTopic((err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    }).then(() => {
      assert.isTrue(sut.isRunning(), 'Bot stopped running.');
      sut.shutdown();
    });
  });

  it('keeps running after an error');
  it('handles no topic found');
  it('handles no valid topics found');
  it('ignores topics without tweets');
  it('ignores promoted topics');
  it('handles text too long');
});
