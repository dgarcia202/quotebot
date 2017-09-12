module.exports.asyncFunc = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('I\'m a promise'), 1000);
  });
};
