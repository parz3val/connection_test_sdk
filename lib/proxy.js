var XMLHttpRequest = require("xhr2");

class proxyTest {
  /**
   * Function to detect the IP and Proxy
   *
   * @returns {Object}
   */
  async behindProxy() {
    const proxyHeader = "via";
    let req = new XMLHttpRequest();
    req.open("GET", document.location, false);
    req.send();
    let header = req.getResponseHeader(proxyHeader);
    if (header) {
      // we are on a proxy
      return true;
    }
    return false;
  }
}

const proxytest = new proxyTest();
module.exports = proxytest;
