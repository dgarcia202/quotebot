"use strinct";

describe('Quotes bot', () => {
  const proxyquire = require('proxyquire');
  const assert = require('chai').assert;
  const sinon = require('sinon');

  let twitterStub = require('../src/twitter-client');
  sut = proxyquire('../src/quotes', {
    './twitter-client': twitterStub
  });

  beforeEach(() => {
    sinon.stub(twitterStub, 'tweet').resolves('fake_twit_id');
  });

  afterEach(() => {
    twitterStub.tweet.restore();
  });

  it('tweets quote', done => {
    sut.tweetQuotes(() => {
      assert(twitterStub.tweet.calledOnce, 'Twitter status was not updated');
      done();
    });
  });
});
