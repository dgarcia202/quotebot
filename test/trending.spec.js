'use strict';

describe('Trending bot', () => {
  const proxyquire = require('proxyquire');
  const assert = require('chai').assert;
  const nock = require('nock');
  const sinon = require('sinon');

  let sut, twitterStub, ritaStub;

  before(() => {
    twitterStub = require('../src/twitter-client');
    ritaStub = require('rita');
    sut = proxyquire('../src/trending', {
      'rita': ritaStub,
      './twitter-client': twitterStub
    });
  });

  beforeEach(() => {
    sinon.stub(twitterStub, 'tweet').resolves('fake_tweet_id');
    sinon.stub(twitterStub, 'getWoeid').resolves('fake_woeid');
    sinon.stub(twitterStub, 'getTopTrend').resolves('some_topic');
    sinon.stub(twitterStub, 'search').resolves(['tweet A', 'tweet B', 'tweet C']);

    sinon.stub(ritaStub.RiMarkov.prototype, 'loadText');
    sinon.stub(ritaStub.RiMarkov.prototype, 'generateSentences').returns(['','','','','']);
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
    sut.tweetOnTrendingTopic((err, data) => {
      assert.isTrue(twitterStub.tweet.calledOnce, 'Nothing was twitted');
      sut.shutdown();
      done();
    });
  });

  it('choses the top topic of the list');
  it('handles twitter client error');
  it('keeps running after an iteration');
  it('keeps running after an error');
  it('handles no topic found');
  it('handles no valid topics found');
  it('ignores topics without tweets');
  it('ignores promoted topics');
  it('handles text too long');
});
