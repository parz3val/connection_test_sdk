// Entrypoint in the package
const ipTest = require("./lib/network.js");
const Connectivity = require("./lib/connectivity.js");
const speedTest = require("./lib/speedTest.js");
const proxy = require("./lib/proxy.js");
const pingTest = require("./lib/pingTest.js");

module.exports = {
  ipTest,
  Connectivity,
  speedTest,
  proxy,
  pingTest,
};
