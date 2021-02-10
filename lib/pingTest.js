const ping = require("ping");

class pingTest {
  /**
   * Returns a ping from the browser to the pingable host
   *
   * @returns {Object}
   */
  async getPing(host) {
    let resp = [];
    await ping.promise.probe(host).then(function (res) {
      resp.push(res);
    });
    return resp;
  }
}

const pingtest = new pingTest();
module.exports = pingtest;
