const ipTest = require("../lib/network.js");
test("testIPLocation", async () => {
  resp = await ipTest.detectIP();
  json = resp[0];
  code = json.countryCode;
  expect(code).toBe("NP");
});
