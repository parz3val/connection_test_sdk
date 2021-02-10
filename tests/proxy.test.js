/**
 * @jest-environment jsdom
 */

const proxyTest = require("../lib/proxy.js");

//Need to run under jsdom/browser and without proxy
// for test to pass
test("testNotUnderProxy", async () => {
  resp = await proxyTest.behindProxy();
  expect(resp).toBe(false);
});
