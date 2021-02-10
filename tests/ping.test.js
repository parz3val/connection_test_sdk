const pingTest = require("../lib/network.js");
const pingtest = require("../lib/pingTest.js");

test("testPing", async () => {
  host = "google.com";
  pingRespone = await pingtest.getPing(host);
  isAlive = pingRespone[0].alive;
  expect(isAlive).toBe(true);
});
