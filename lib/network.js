class ipTest {
  /**
   * Function to detect the IP and Proxy
   *
   * @returns {Object}
   */

  detectIP() {
    // may be we need to hit our own server which will hit multiple server if one is busy
    fetch("https://extreme-ip-lookup.com/json/")
      .then((res) => res.json())
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("Request failed:", error);
      });
  }

  detectProxy() {}
}

export { ipTest };
