'use strict';

const proxyquire = require('proxyquire');
const assert = require('chai').assert;
const nock = require('nock');
const sinon = require('sinon');

let twitterStub = require('../src/twitter-client');
let sut = proxyquire('../src/quotes', {
  './twitter-client': twitterStub
});

describe('Quotes bot', () => {

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

  function mockQuoreRequestError() {
    nock('http://api.forismatic.com:80', {"encodedQueryParams":true})
      .post('/api/1.0/', "method=getQuote&format=json&key=5126296161&lang=en")
      .replyWithError('Internal server error');
  }

  beforeEach(() => {
    sinon.stub(twitterStub, 'tweet').resolves('fake_twit_id');
  });

  afterEach(() => {
    twitterStub.tweet.restore();
    nock.cleanAll();
  });

  it('successfully tweets quote', done => {
    mockQuoteRequestOk();
    sut.tweetQuotes((err, data) => {
      assert.isNotOk(err, 'Unexpected error happened');
      assert.equal(data, 'fake_twit_id', 'Tweet id is not correct.');
      assert.isTrue(twitterStub.tweet.called, 'Twitter status was not updated.');
      sut.shutdown();
      done();
    });
  });

  it('avoids tweeting when quote is too long', done => {
    mockQuoteRequestTooLong();
    sut.tweetQuotes((err) => {
      assert.isOk(err, 'Error object is not set.');
      assert.isNotTrue(twitterStub.tweet.called, 'Twitter status shouldn\'t be updated.');
      sut.shutdown();
      done();
    });
  });

  it('handles quote API down', done => {
    mockQuoreRequestError();
    sut.tweetQuotes((err) => {
      assert.isOk(err, 'Error object is not set.');
      assert.isNotTrue(twitterStub.tweet.called, 'Twitter status shouldn\'t be updated.');
      sut.shutdown();
      done();
    });
  });

  it('handles twitter client error', done => {
    mockQuoteRequestOk();
    twitterStub.tweet.throws();
    sut.tweetQuotes((err) => {
      assert.isOk(err, 'Error object is not set.');
      assert.isTrue(twitterStub.tweet.called, 'Twitter call wasn\'t made.');
      sut.shutdown();
      done();
    });
  });

  it('keeps running after successful quote', done => {
    mockQuoteRequestOk();
    sut.tweetQuotes(() => {
      assert.isTrue(sut.isRunning(), 'Bot stopped running.');
      sut.shutdown();
      done();
    });
  });

  it('keeps running after error', done => {
    mockQuoreRequestError();
    sut.tweetQuotes(() => {
      assert.isTrue(sut.isRunning(), 'Bot stopped running.');
      sut.shutdown();
      done();
    });
  });
});
