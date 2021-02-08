class proxyTest {
  /**
   * Function to detect the IP and Proxy
   *
   * @returns {Object}
   */
  behindProxy() {
    var proxyHeader = "via";
    var req = new XMLHttpRequest();
    req.open("GET", document.location, false);
    req.send();
    var header = req.getResponseHeader(proxyHeader);
    if (header) {
      // we are on a proxy
      return true;
    }
    return false;
  }
}

export { ipTest };
