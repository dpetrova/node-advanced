import express from "express";
import crypto from "crypto";

const app = express();

function doWork(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {}
}

app.get("/", (req, res) => {
  // doWork(5000); //blocking the event loop
  // res.send("Hi there!");

  //blocking the event loop
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    res.send("Hi there!");
  });
});

app.get("/fast", (req, res) => {
  res.send("This is fast!");
});

app.listen(3000);

/* use pm2 in cluster mode to start the app:
1. install pm2 globally: npm install pm2@latest -g
2. start app in cluster mode: pm2 start index.js -i 0
*/
