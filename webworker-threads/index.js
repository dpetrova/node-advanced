import express from "express";
import {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} from "node:worker_threads";

const app = express();

app.get("/", (req, res) => {
  // create a webworker running in parallel on a separate thread
  const worker = new Worker("./worker.js", {
    workerData: { a: 1, b: 2, c: 3 },
  });

  /* worker handlers */
  // wait for message from worker and send data to browser
  worker.on("message", (msg) => {
    res.send("task done: " + msg);
  });
  // clean up
  worker.on("exit", (code) => {});

  // delegate a heavy task to worker
  worker.postMessage("do some work");
});

app.listen(3000);
