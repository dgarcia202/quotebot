"use strict";

const config = require('./config');
const twitter = require('./twitter-client');

let timeout = null;

module.exports.isRunning = () => {
  return timeout !== null;
};

module.exports.updateOverTime = function update(callback) {
  Promise.all([twitter.getAllFollowerIds(), twitter.getAllFriendIds()])
    .then(values => {
      let followers = values.first();
      let friends = values.last();
      let to_follow = followers.diff(friends);
      
      let follow_tasks = [];
      to_follow.forEach(id => {
        follow_tasks.push(twitter.follow(id));
      });

      return Promise.all(follow_tasks);
    })
    .then(values => {
      timeout = setTimeout(() => {
        update(callback);
      }, config.followback_interval);

      if (callback) {
        callback(null, values);
      }
    })
    .catch(err => {
      if (callback) {
        callback(err);
      }
    });
};

module.exports.shutdown = () => {
  if (timeout) {
    clearTimeout(timeout);
  }
};
