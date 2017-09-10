'use strict';

const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config);

function getFollowersRecursive(cursor, ids, callback) {
  twit.get('followers/ids', {
    screen_name: 'ginomi', // 'sillyrobot14'
    count:5000,
    cursor: cursor
  }, (err, data, response) => {
    if (err) {
      throw err;
    } else {
      ids = ids.concat(data.ids);
      console.log('partial ++' + data.ids.length);
      if (data.next_cursor_str !== '0') {
        getFollowersRecursive(data.next_cursor_str, ids, callback);
      } else {
        callback(ids);
      }
    }
  })
}

function getAllFollowers() {
  return new Promise((resolve, reject) => {
    getFollowersRecursive('-1', [], (ids) => {
      resolve(ids);
    });
  });
}

module.exports.update = () => {
  getAllFollowers().then((ids) => console.log('length' + ids.length));
};
