const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config.twitter);

function getFollowersRecursive(cursor, ids, callback) {
  twit.get('followers/ids', {
    screen_name: config.screen_name,
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
    screen_name: config.screen_name,
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

module.exports.tweet = (status_text) => {
  return new Promise((resolve, reject) => {
    twit.post('statuses/update', {
      status: status_text
    }, (err, data, response) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(data.id_str);
      }
    });
  });
};

module.exports.getAllFollowerIds = () => {
  return new Promise((resolve, reject) => {
    getFollowersRecursive('-1', [], (ids) => {
      resolve(ids);
    });
  });
};

module.exports.getAllFriendIds = () => {
  return new Promise((resolve, reject) => {
    getFriendsRecurive('-1', [], (ids) => {
      resolve(ids);
    });
  });
};

module.exports.follow = (id) => {
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
