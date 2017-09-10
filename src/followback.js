'use strict';

const Twit = require('twit');
const config = require('./config');

const twit = new Twit(config);

function getFollowersRecursive(cursor, ids, callback) {
  twit.get('followers/ids', {
    screen_name: 'ginomi', // 'sillyrobot14'
    count:200,
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
  getFollowersRecursive('-1', [], (ids) => {
    console.log('++++++++' + ids.length);
  });
}

module.exports.run = getAllFollowers;
