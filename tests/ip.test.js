const ipTest = require("../lib/network.js");
//
// Test the location and IP getting module
test("testIPLocation", async () => {
  resp = await ipTest.detectIP();
  json = resp[0];
  console.log(json);
  code = json.countryCode;
  expect(code).toBe("NP");
});
//
// Test the If user is on vpn
test("testIF on VPN", async () => {
  resp = await ipTest.detectVPN("202.51.80.116",process.env.QUALITY_IP_API_KEY);
  json = resp[0];
  code = json.vpn;
  console.log(json);
  expect(code).toBe(false);
});
