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
};

module.exports.getWoeid = (city, country) => {
  return new Promise((resolve, reject) => {
    twit.get('trends/available',
    {
    },
    (err, data, response) => {
      if (err) {
        reject(err.message);
      } else {
        let filtered = data.filter(x => x.name == city && x.country == country);
        if (filtered.length == 0) {
          reject('New york in the US not found as a trending place available');
        } else {
          resolve(filtered[0].woeid);
        }
      }
    });
  });
}

module.exports.getTopTrend = woeid => {
  return new Promise((resolve, reject) => {
    twit.get('trends/place',
    {
      id: woeid
    },
    (err, data, response) => {
      if (err) {
        reject(err);
      } else {
        var trends = data[0]
                .trends
                .filter(x => x.promoted_content == null && x.tweet_volume != null)
                .sort((a, b) => b.tweet_volume - a.tweet_volume);

        if (trends.length == 0) {
          reject(new Error('No valid trends found in the specified location'));
        } else {
          resolve(trends[0].query);
        }
      }
    });
  });
}

module.exports.search = query => {
  return new Promise((resolve, reject) => {
    twit.get('search/tweets', {
      q: query,
      count: 100,
      lang: 'en'
    }, (err, data, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.statuses.map(x => x.text));
      }
    });
  });
}
