// The code won't run on cli without `perf hooks`
//const { performance } = require("perf_hooks");
const https = require("https");
const stats = require("./calc.js");

async function get(hostname, path) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        path,
        method: "GET",
      },
      (res) => {
        const body = [];
        res.on("data", (chunk) => {
          body.push(chunk);
        });
        res.on("end", () => {
          try {
            resolve(Buffer.concat(body).toString());
          } catch (e) {
            reject(e);
          }
        });
        req.on("error", (err) => {
          reject(err);
        });
      }
    );

    req.end();
  });
}

async function fetchServerLocationData() {
  const res = JSON.parse(await get("speed.cloudflare.com", "/locations"));

  return res.reduce((data, { iata, city }) => {
    // Bypass prettier "no-assign-param" rules
    const data1 = data;

    data1[iata] = city;
    return data1;
  }, {});
}

function fetchCfCdnCgiTrace() {
  const parseCfCdnCgiTrace = (text) =>
    text
      .split("\n")
      .map((i) => {
        const j = i.split("=");

        return [j[0], j[1]];
      })
      .reduce((data, [k, v]) => {
        if (v === undefined) return data;

        // Bypass prettier "no-assign-param" rules
        const data1 = data;
        // Object.fromEntries is only supported by Node.js 12 or newer
        data1[k] = v;

        return data1;
      }, {});

  return get("speed.cloudflare.com", "/cdn-cgi/trace").then(parseCfCdnCgiTrace);
}

function request(options, data = "") {
  let started;
  let dnsLookup;
  let tcpHandshake;
  let sslHandshake;
  let ttfb;
  let ended;

  return new Promise((resolve, reject) => {
    started = performance.now();
    //console.log("started -> ", started);
    const req = https.request(options, (res) => {
      res.once("readable", () => {
        ttfb = performance.now();
        //console.log("Result of perform.now->", ttfb);
      });
      res.on("data", () => {});
      res.on("end", () => {
        ended = performance.now();
        console.log("Ended -> ", ended);
        resolve([
          started,
          dnsLookup,
          tcpHandshake,
          sslHandshake,
          ttfb,
          ended,
          parseFloat(res.headers["server-timing"].slice(22)),
        ]);
      });
    });

    req.on("socket", (socket) => {
      socket.on("lookup", () => {
        dnsLookup = performance.now();
        //console.log("Dns Lookup->", dnsLookup);
      });
      socket.on("connect", () => {
        tcpHandshake = performance.now();
        //console.log("TCP Handshake->", tcpHandshake);
      });
      socket.on("secureConnect", () => {
        sslHandshake = performance.now();
        //console.log("SSL Handshake->", sslHandshake);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

function download(bytes) {
  const options = {
    hostname: "speed.cloudflare.com",
    path: `/__down?bytes=${bytes}`,
    method: "GET",
  };

  return request(options);
}

function upload(bytes) {
  const data = "0".repeat(bytes);
  const options = {
    hostname: "speed.cloudflare.com",
    path: "/__up",
    method: "POST",
    headers: {
      "Content-Length": Buffer.byteLength(data),
    },
  };

  return request(options, data);
}

function measureSpeed(bytes, duration) {
  return (bytes * 8) / (duration / 1000) / 1e6;
}

async function measureLatency() {
  const measurements = [];

  for (let i = 0; i < 20; i += 1) {
    await download(1000).then(
      (response) => {
        // TTFB - Server processing time
        measurements.push(response[4] - response[0] - response[6]);
      },
      (error) => {
        console.log(`Error: ${error}`);
      }
    );
  }

  return [
    Math.min(...measurements),
    Math.max(...measurements),
    stats.average(measurements),
    stats.median(measurements),
    stats.jitter(measurements),
  ];
}

async function measureDownload(bytes, iterations) {
  const measurements = [];

  for (let i = 0; i < iterations; i += 1) {
    await download(bytes).then(
      (response) => {
        const transferTime = response[5] - response[4];
        measurements.push(measureSpeed(bytes, transferTime));
      },
      (error) => {
        console.log(`Error: ${error}`);
      }
    );
  }

  return measurements;
}

async function measureUpload(bytes, iterations) {
  const measurements = [];

  for (let i = 0; i < iterations; i += 1) {
    await upload(bytes).then(
      (response) => {
        const transferTime = response[6];
        measurements.push(measureSpeed(bytes, transferTime));
      },
      (error) => {
        console.log(`Error: ${error}`);
      }
    );
  }

  return measurements;
}

function logLatency(data) {
  //console.log(bold("         Latency:", magenta(`${data[3].toFixed(2)} ms`)));
  //console.log(bold("          Jitter:", magenta(`${data[4].toFixed(2)} ms`)));
  return {
    latency: data[3].toFixed(2),
    jitter: data[4].toFixed(2),
    unit: "ms",
  };
}

function logSpeedTestResult(test) {
  const speed = stats.median(test).toFixed(2);
  return speed;
}

function logDownloadSpeed(tests) {
  return stats.quartile(tests, 0.9).toFixed(2);
}

function logUploadSpeed(tests) {
  return stats.quartile(tests, 0.9).toFixed(2);
}

async function speedTest() {
  const [ping, serverLocationData, { ip, loc, colo }] = await Promise.all([
    measureLatency(),
    fetchServerLocationData(),
    fetchCfCdnCgiTrace(),
  ]);

  const testDown1 = await measureDownload(101000, 10);
  console.log("100 KB download ->", testDown1);
  const testDown2 = await measureDownload(1001000, 8);
  const testDown3 = await measureDownload(10001000, 6);
  const testDown4 = await measureDownload(25001000, 4);

  // Use 100 Mb download only in speeds above 100 Mbps

  //const testDown5 = await measureDownload(100001000, 1);
  //console.log("100 MB Test->", logSpeedTestResult(testDown5));

  const downloadTests = [
    ...testDown1,
    ...testDown2,
    ...testDown3,
    ...testDown4,
  ];

  const testUp1 = await measureUpload(11000, 10);
  const testUp2 = await measureUpload(101000, 10);
  const testUp3 = await measureUpload(1001000, 8);
  const uploadTests = [...testUp1, ...testUp2, ...testUp3];

  const metrics = {
    networkMetrics: {
      city: serverLocationData[colo],
      symbol: colo,
      ip: ip,
    },
    latencyMetrics: logLatency(ping),
    speedMetrics: {
      download: {
        speed100Kb: logSpeedTestResult(testDown1),
        speed1Mb: logSpeedTestResult(testDown2),
        speed10Mb: logSpeedTestResult(testDown3),
        speed25Mb: logSpeedTestResult(testDown4),
        average: logDownloadSpeed(downloadTests),
        unit: "Mbps",
      },
      upload: {
        average: logUploadSpeed(uploadTests),
        unit: "Mbps",
      },
    },
  };

  //console.log("Everything done");
  //console.log(metrics);
  return metrics;
}

module.exports = speedTest;
