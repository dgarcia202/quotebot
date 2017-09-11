"use strict";

const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config);

let timeout;

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

function followUser(id) {
  return new Promise((resolve, reject) => {
    twit.post('friendships/create', {
      user_id: id
    }, (err, data, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.id_str);
      }
    })
  });
}

module.exports.updateOverTime = function update() {
  Promise.all([getAllFollowers(), getAllFriends()])
    .then(values => {
      let followers = values.first();
      let friends = values.last();

      console.log(`A total of ${followers.length} followers and ${friends.length} friends found.`);

      let to_follow = followers.diff(friends);
      console.log(`A total of ${to_follow.length} unfollowed followers found.`);
      let follow_tasks = [];
      to_follow.forEach(id => {
        follow_tasks.push(followUser(id));
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
    }, 3600000);
};

module.exports.shutdown = () => {
  console.info('Shutting down follow back bot!');
  if (timeout) {
    clearTimeout(timeout);
  }
};
