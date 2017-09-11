"use strict";

require('./array-exts');

const config = require('./config');
const readline = require('readline');
const bot = require('./bot');
const web = require('./web');

if (process.platform === "win32") {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
  bot.shutdown();
  process.exit();
});

bot.run();
if (config.start_http) {
  web.start();
}
