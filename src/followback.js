"use strict";

const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config);

function getFollowersRecursive(cursor, ids, callback) {
  twit.get('followers/ids', {
    screen_name: 'sillyrobot14',
    count:5000,
    cursor: cursor,
    stringify_ids: true
  }, (err, data, response) => {
    if (err) {
      throw err;
    } else {
      ids = ids.concat(data.ids);
      if (data.next_cursor_str !== '0') {
        getFollowersRecursive(data.next_cursor_str, ids, callback);
      } else {
        callback(ids);
      }
    }
  });
}

function getFriendsRecurive(cursor, ids, callback) {
  twit.get('friends/ids', {
    screen_name: 'sillyrobot14', // 'sillyrobot14',
    count:100,
    cursor: cursor,
    stringify_ids: true
  }, (err, data, response) => {
    if (err) {
      throw err;
    } else {
      ids = ids.concat(data.ids);
      if (data.next_cursor_str !== '0') {
        getFriendsRecurive(data.next_cursor_str, ids, callback);
      } else {
        callback(ids);
      }
    }
  });
}

function getAllFollowers() {
  return new Promise((resolve, reject) => {
    getFollowersRecursive('-1', [], (ids) => {
      resolve(ids);
    });
  });
}

function getAllFriends() {
  return new Promise((resolve, reject) => {
    getFriendsRecurive('-1', [], (ids) => {
      resolve(ids);
    });
  });
}

module.exports.update = () => {
  Promise.all([getAllFollowers(), getAllFriends()])
    .then(values => {
      let followers = values.first();
      let friends = values.last();

      console.log(`A total of ${followers.length} followers and ${friends.length} friends found.`);

      let to_follow = followers.diff(friends);
      console.log(`A total of ${to_follow.length} unfollowed followers found.`);
      console.log(to_follow);
    })
    .catch(err => {
      console.error(err);
    });
};
