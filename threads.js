// process.env.UV_THREADPOOL_SIZE=5 // do not work on Windows !!!

const crypto = require("crypto");

const start = Date.now();

// call async Password-Based Key Derivation Function 2
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("1:", Date.now() - start);
});

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("2:", Date.now() - start);
});

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("3:", Date.now() - start);
});

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("4:", Date.now() - start);
});

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("5:", Date.now() - start);
});

// first 4 functions are executed simultaniously because used the 4 threads of libuv Thread pool
// the last one is executed next after the first 4 are finished and there are a free thread

/* to change the size of the threadpool, start the script with:
UV_THREADPOOL_SIZE=5 node threads.js
*/
