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
  async detectVPN(ip, qualtyIpApiKey) {
    // may be we need to hit our own server which will hit multiple server if one is busy
    let resp = [];
    const qualityIPURL =
      "https://ipqualityscore.com/api/json/ip/" +
      qualtyIpApiKey +
      "/" +
      ip +
      "?strictness=1&user_agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36&user_language=en-US";
    await fetch(qualityIPURL, { method: "GET" })
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
