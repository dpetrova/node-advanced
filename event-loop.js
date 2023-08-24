/* start Node program -> node myFile.js */

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// 1. Node takes the content of the file and execute all the code inside it.
// New timers, tasks, operations are recorded from myFile running
myFile.runContent();

// 2. Every single time that the event loop is about to execute node first do a check
// to decide whether or not to allow the loop to proceed for another iteration, or to exit the program
function shouldContinue() {
  // check_1: any pending setTimeout, setInterval, setImmediate
  // check_2: any pending OS tasks (like server listening to a port)
  // check_3: any pending long running operations that are still being executes inside of a program (like fs module, e.g.reading a file from a hard drive)
  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
}

// 3. Enter Node event loop (something like while loop that is going to execute again and again and again).
// Тhe execution of the entire body of the loop as a 'tick'
while (shouldContinue()) {
  // 1) Node looks at pendingTimers (setTimeout, setInterval) and see if any functions are ready to be called
  // 2) Node looks at pendingOSTasks and pendingOperations and calls relevant callbacks
  // 3) Pause the execution temporary (waits for new events to occur). Continue when:
  //    - a new pendingOSTask is done
  //    - a new pendingOperation is done
  //    - a pendingTimer is about to complete
  // 4) Look at pendingTimers and call any setImmediate
  // 5) Handle any 'close' events (e.g .on('close', callback) of readStream)
}

/* exit back to terminal */
