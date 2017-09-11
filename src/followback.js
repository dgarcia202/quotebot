"use strict";

const config = require('./config');
const twitter = require('./twitter-client');

let timeout = null;

module.exports.updateOverTime = function update() {
  Promise.all([twitter.getAllFollowerIds(), twitter.getAllFriendIds()])
    .then(values => {
      let followers = values.first();
      let friends = values.last();

      console.log(`A total of ${followers.length} followers and ${friends.length} friends found.`);

      let to_follow = followers.diff(friends);
      console.log(`A total of ${to_follow.length} unfollowed followers found.`);
      let follow_tasks = [];
      to_follow.forEach(id => {
        follow_tasks.push(twitter.follow(id));
      });

      return Promise.all(follow_tasks);
    })
    .then(values => {
      console.log(`${values.length} users followed`);
    })
    .catch(err => {
      console.error(err);
    });

    timeout = setTimeout(() => {
      update();
    }, config.followback_interval);
};

module.exports.shutdown = () => {
  console.info('Shutting down follow back bot!');
  if (timeout) {
    clearTimeout(timeout);
  }
};
