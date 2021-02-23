const fetch = require("node-fetch");
require("dotenv").config();
class ipTest {
  /**
   * Function to detect the IP
   *
   * @returns {Object}
   */
  async detectIP() {
    // may be we need to hit our own server which will hit multiple server if one is busy
    let resp = [];
    await fetch("https://extreme-ip-lookup.com/json/")
      .then((res) => res.json())
      .then((json) => {
        resp.push(json);
      })
      .catch((error) => {
        console.log("Request failed:", error);
      });
    return resp;
  }
  async detectVPN(ip,qualtyIpApiKey) {
    // may be we need to hit our own server which will hit multiple server if one is busy
    let resp = [];
    const qualityIPURL =
      "https://ipqualityscore.com/api/json/ip/" +
      qualtyIpApiKey +
      "/" +
      ip;
    await fetch(qualityIPURL)
      .then((res) => res.json())
      .then((json) => {
        resp.push(json);
      })
      .catch((error) => {
        console.log("Request failed:", error);
      });
    return resp;
  }
}

const iptest = new ipTest();
module.exports = iptest;
