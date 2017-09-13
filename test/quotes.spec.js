"use strict";

describe('Quotes bot', () => {
  const proxyquire = require('proxyquire');
  const assert = require('chai').assert;
  const nock = require('nock');
  const sinon = require('sinon');

  let twitterStub = require('../src/twitter-client');
  let sut = proxyquire('../src/quotes', {
    './twitter-client': twitterStub
  });

  function mockQuoteRequestOk() {
    nock('http://api.forismatic.com:80', {"encodedQueryParams":true})
      .post('/api/1.0/', "method=getQuote&format=json&key=5126296161&lang=en")
      .reply(200, {
        quoteText: 'If you do what youve always done, youll get what youve always gotten.',
        quoteAuthor: 'Tony Robbins',
        senderName: '',
        senderLink: '',
        quoteLink: 'http://forismatic.com/en/35cd7bb2e3/'
      });
  }

  function mockQuoteRequestTooLong() {
    nock('http://api.forismatic.com:80', {"encodedQueryParams":true})
      .post('/api/1.0/', "method=getQuote&format=json&key=5126296161&lang=en")
      .reply(200, {
        quoteText: 'If you do what youve always done, youll get what youve always gotten. If you do what youve always done, youll get what youve always gotten. If you do what youve.',
        quoteAuthor: 'Tony Robbins',
        senderName: '',
        senderLink: '',
        quoteLink: 'http://forismatic.com/en/35cd7bb2e3/'
      });
  }

  beforeEach(() => {
    sinon.stub(twitterStub, 'tweet').resolves('fake_twit_id');
  });

  afterEach(() => {
    twitterStub.tweet.restore();
    nock.cleanAll();
  });

  it('tweets quote', done => {
    mockQuoteRequestOk();
    sut.tweetQuotes((err, data) => {
      assert.equal(data, 'fake_twit_id', 'Tweet id is not correct.');
      assert.isTrue(twitterStub.tweet.called, 'Twitter status was not updated.');
      done();
    });
  });

  it('avoids tweeting when quote is too long', done => {
    mockQuoteRequestTooLong();
    sut.tweetQuotes((err, data) => {
      assert.isOk(err, 'Error object is not set.');
      assert.isNotTrue(twitterStub.tweet.called, 'Twitter status shouldn\'t be updated.');
      done();
    });
  });
});
