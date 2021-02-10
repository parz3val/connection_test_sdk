const ipTest = require("../lib/network.js");
//
// Test the location and IP getting module
test("testIPLocation", async () => {
  resp = await ipTest.detectIP();
  json = resp[0];
  code = json.countryCode;
  expect(code).toBe("NP");
});
