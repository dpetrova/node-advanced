const https = require("https");
const crypto = require("crypto");
const fs = require("fs");

const start = Date.now();

function doRequest() {
  https
    .request("https://www.google.com", (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        console.log("Http: ", Date.now() - start);
      });
    })
    .end();
}

function doHash() {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log("Hash: ", Date.now() - start);
  });
}

function doFileRead() {
  fs.readFile("multitask.js", "utf8", () => {
    console.log("FS: ", Date.now() - start);
  });
}

doRequest();
doFileRead();
doHash();
doHash();
doHash();
doHash();

/*
flow:
- Http is executed separately by OS
- Thread pool execute FS and Crypto (there are 4 default Threads):
    1. FS started executed at Thread_1, but it is long operation involves hard disk access
    2. So while waiting these long operation Thread_1 stop executing FS and take the waiting Crypto (doHash #4)
    3. after some Thread finish its task and is free, it takes back FS
*/

/*
to change the size of the threadpool, start the script with:
UV_THREADPOOL_SIZE=5 node multitask.js
*/