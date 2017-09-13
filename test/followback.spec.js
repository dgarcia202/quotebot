'use strict';

describe('Folowback bot', () => {
  const proxyquire = require('proxyquire');
  const assert = require('chai').assert;
  const nock = require('nock');
  const sinon = require('sinon');

  let twitterStub = require('../src/twitter-client');
  let sut = proxyquire('../src/followback', {
    './twitter-client': twitterStub
  });

  beforeEach(() => {
    sinon.stub(twitterStub, 'getAllFollowerIds').resolves(['1', '2', '3', '4', '5']);
    sinon.stub(twitterStub, 'getAllFriendIds').resolves(['1', '2', '3']);
    sinon.stub(twitterStub, 'follow').resolves('fake_user_id');
  });

  afterEach(() => {
    twitterStub.getAllFollowerIds.restore();
    twitterStub.getAllFriendIds.restore();
    twitterStub.follow.restore();
  });

  it('follows back new followers', done => {
    sut.updateOverTime((err, data) => {
      assert.isTrue(twitterStub.follow.calledTwice, 'Twitter follow method was not called the correct number of times.');
      sut.shutdown();
      done();
    });
  });

  it('handles no new users to follow', done => {
    twitterStub.getAllFollowerIds.resolves(['1', '2', '3']);
    twitterStub.getAllFriendIds.resolves(['1', '2', '3']);
    sut.updateOverTime((err, data) => {
      assert.isNotTrue(twitterStub.follow.called, 'Twitter follow method should not be called.');
      sut.shutdown();
      done();
    });
  });

  it('handles twitter client error', done => {
    twitterStub.getAllFollowerIds.rejects(new Error('Twitter is down!'));
    twitterStub.getAllFriendIds.rejects(new Error('Twitter is down!'));
    twitterStub.follow.rejects(new Error('Twitter is down!'));
    sut.updateOverTime((err, data) => {
      assert.isOk(err, 'Error variable not set.');
      sut.shutdown();
      done();
    });
  });

  it('keeps running after an iteration', done => {
    sut.updateOverTime((err, data) => {
      assert.isTrue(sut.isRunning(), 'Bot stopped running.');
      sut.shutdown();
      done();
    });
  });

  it('keeps running after failure', done => {
    sut.updateOverTime((err, data) => {
      assert.isTrue(sut.isRunning(), 'Bot stopped running.');
      sut.shutdown();
      done();
    });
  });
});
