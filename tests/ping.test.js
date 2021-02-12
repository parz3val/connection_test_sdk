const pingTest = require("../lib/network.js");
const pingtest = require("../lib/pingTest.js");

test("testPing", async () => {
  host = "google.com";
  pingRespone = await pingtest.getPing(host);
  isAlive = pingRespone[0].alive;
  expect(isAlive).toBe(true);
});

test("testPingKrispcalls", async () => {
  host = "twilio.com";
  pingRespone = await pingtest.getPing(host);
  console.log(pingRespone);
  isAlive = pingRespone[0].alive;
  expect(isAlive).toBe(true);
});
