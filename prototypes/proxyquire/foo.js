const path = require('path');
const bar = require('./bar');

module.exports.extnameAllCaps = function (file) {
  return path.extname(file).toUpperCase();
};

module.exports.basenameAllCaps = function (file) {
  return path.basename(file).toUpperCase();
};

module.exports.asyncTask = function (callback) {
  bar.asyncFunc().then(msg => {
    callback(msg);
  });
};
