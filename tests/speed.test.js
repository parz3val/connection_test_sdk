const Connectivity = require("../lib/connectivity.js");

/*
Test the https download speed func
*/
test("testHttpsDownloadSpeed", async () => {
  const baseUrl = "https://eu.httpbin.org/stream-bytes/50000000";
  const fileSize = 500000;
  try {
    const speed = await Connectivity.checkDownloadSpeed(baseUrl, fileSize);
    console.log(speed);
    expect(speed).to.include.all.keys("bps", "kbps", "mbps");
  } catch (err) {
    console.log(err);
  }
});

/*
Test the http download speed func
*/
test("testHttpDownloadSpeed", async () => {
  const baseUrl = "http://eu.httpbin.org/stream-bytes/50000000";
  const fileSize = 500000;
  try {
    const speed = await Connectivity.checkDownloadSpeed(baseUrl, fileSize);
    console.log(speed);
    expect(speed).to.include.all.keys("bps", "kbps", "mbps");
  } catch (err) {
    console.log(err);
  }
});

// Check upload speed func
test("testUploadSpeed", async () => {
  const options = {
    hostname: "www.google.com",
    port: 80,
    path: "/catchers/544b09b4599c1d0200000289",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const speed = await Connectivity.checkUploadSpeed(options);
    console.log(speed);
    expect(speed).to.include.all.keys("bps", "kbps", "mbps");
  } catch (err) {
    console.log(err);
  }
});
