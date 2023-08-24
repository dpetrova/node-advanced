import { parentPort } from "node:worker_threads";

function doWork() {
  let counter = 0;
  while (counter < 1e9) {
    // 1e9 == 10^9
    counter++;
  }
  return counter;
}

// worker message handler
parentPort.on("message", (e) => {
  console.log(e);
  const counter = doWork();
  // return result to main
  parentPort.postMessage(counter);
});
