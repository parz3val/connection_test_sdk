const speedtest = require("../lib/speedTest.js");

test("testDownload", async () => {
  // 100 KB test 10 times
  let downloadTest = await speedtest.measureDownload(101000, 10);
  console.log(downloadTest);
  test_len = downloadTest.length;
  expect(test_len).toBe(10);
});

test("testUpload", async () => {
  // 100 KB test 10 times
  let uploadTest = await speedtest.measureUpload(101000, 10);
  console.log(uploadTest);
  test_len = uploadTest.length;
  expect(test_len).toBe(10);
});

test("testLatency", async () => {
  // 100 KB test 10 times
  let latencyTest = await speedtest.measureLatency();
  console.log(latencyTest);
  test_len = latencyTest.length;
  expect(test_len).toBe(4);
});
