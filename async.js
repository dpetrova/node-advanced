const https = require("https");

const start = Date.now();

function doRequest() {
  https
    .request("https://www.google.com", (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        console.log(Date.now() - start);
      });
    })
    .end();
}

doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();

/*
OS does the real http request entirely outside the event loop.
Neither node or libuv have code to handle super low level operations like network requests.
Instead libuv delegates requests making to OS.
OS itself decides whether or not to make a new thread.
There is no blocking of JS code inside of event loop. 
*/
