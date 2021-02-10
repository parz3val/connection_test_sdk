const { performance } = require("perf_hooks");
const https = require("https");
const calc = require("./calc.js");

class cloudFlare {
  /*
   -> Returns users bandwidth test 
   -> From cloudflare
   */

  /* Send the request */
  async get(hostname, path) {
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

  /* Fetch server location */
  async fetchServerLocationData() {
    const res = JSON.parse(
      await this.get("speed.cloudflare.com", "/locations")
    );

    return res.reduce((data, { iata, city }) => {
      // Bypass prettier "no-assign-param" rules
      const data1 = data;
      console.log(data1);
      data1[iata] = city;
      return data1;
    }, {});
  }

  /* Fetch CDN trace */
  async fetchCfCdnCgiTrace() {
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

    return this.get("speed.cloudflare.com", "/cdn-cgi/trace").then(
      parseCfCdnCgiTrace
    );
  }

  /* Send request*/
  request(options, data = "") {
    let started;
    let dnsLookup;
    let tcpHandshake;
    let sslHandshake;
    let ttfb;
    let ended;

    return new Promise((resolve, reject) => {
      started = performance.now();
      const req = https.request(options, (res) => {
        res.once("readable", () => {
          ttfb = performance.now();
        });
        res.on("data", () => {});
        res.on("end", () => {
          ended = performance.now();
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
        });
        socket.on("connect", () => {
          tcpHandshake = performance.now();
        });
        socket.on("secureConnect", () => {
          sslHandshake = performance.now();
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });
  }

  /* Download bytes */
  download(bytes) {
    const options = {
      hostname: "speed.cloudflare.com",
      path: `/__down?bytes=${bytes}`,
      method: "GET",
    };

    return this.request(options);
  }

  /* Upload bytes */
  upload(bytes) {
    const data = "0".repeat(bytes);
    const options = {
      hostname: "speed.cloudflare.com",
      path: "/__up",
      method: "POST",
      headers: {
        "Content-Length": Buffer.byteLength(data),
      },
    };

    return this.request(options, data);
  }

  /* Measure speed  from bytes and duration it took
     to download it.
     */
  measureSpeed(bytes, duration) {
    return (bytes * 8) / (duration / 1000) / 1e6;
  }

  /* Measure latency */

  async measureLatency() {
    const measurements = [];
    for (let i = 0; i < 20; i += 1) {
      await this.download(1000).then(
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
      calc.average(measurements),
      calc.median(measurements),
    ];
  }

  /* Measure download speed*/
  async measureDownload(bytes, iterations) {
    const measurements = [];

    for (let i = 0; i < iterations; i += 1) {
      await this.download(bytes).then(
        (response) => {
          const transferTime = response[5] - response[4];
          measurements.push(this.measureSpeed(bytes, transferTime));
        },
        (error) => {
          console.log(`Error: ${error}`);
        }
      );
    }
    return measurements;
  }

  /* Measure upload speed*/
  async measureUpload(bytes, iterations) {
    const measurements = [];

    for (let i = 0; i < iterations; i += 1) {
      await this.upload(bytes).then(
        (response) => {
          const transferTime = response[6];
          measurements.push(this.measureSpeed(bytes, transferTime));
        },
        (error) => {
          console.log(`Error: ${error}`);
        }
      );
    }

    return measurements;
  }
}

const speedtst = new cloudFlare();

module.exports = speedtst;
