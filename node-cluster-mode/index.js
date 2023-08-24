import cluster from "cluster";
import express from "express";
import crypto from "crypto";

// is the file executed for the very first time "in primary mode" -> this will create a Cluster manager instance
if (cluster.isPrimary) {
  // if is primary -> execute index.js again but "in child mode" -> this will create Worker instances
  cluster.fork();
  cluster.fork();

  // whenever we create a cluster every single child has their own separate thread pool, so normally every child that we would create has a group of four threads
} else {
  // if is a child -> act like a normal express server
  console.log(`worker pid=${process.pid}`);

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
}
