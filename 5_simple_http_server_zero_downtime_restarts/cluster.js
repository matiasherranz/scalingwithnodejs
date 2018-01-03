// cluster.js
var cluster = require("cluster");

if (cluster.isMaster) {
    // this is the master control process
    console.log("Control process running: PID=" + process.pid);

    // fork as many times as we have CPUs
    var numCPUs = require("os").cpus().length;

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // handle unwanted worker exits
    cluster.on("exit", function(worker, code) {
        if (code != 0) {
            console.log("Worker crashed! Spawning a replacement.");
            cluster.fork();
        }
    });

    // I'm using the SIGUSR2 signal to listen for reload requests
    // you could, instead, use file watcher logic, or anything else
    process.on("SIGUSR2", function() {
      console.log("\n\n--->[SIGUSR2 received] Reloading workers!!\n");

      // delete the cached module, so we can reload the app
      delete require.cache[require.resolve("./server")];

      // only reload one worker at a time
      // otherwise, we'll have a time when no request handlers are running
      var i = 0;
      var workers = Object.values(cluster.workers);
      var workersRestartHandler = function() {
        const worker = workers[i];
        if (i == workers.length) return;

        console.log(`Killing worker with pid: ${worker.process.pid}`);

        worker.disconnect();
        worker.on("disconnect", function() {
            console.log("Shutdown complete");
        });
        var newWorker = cluster.fork();
        newWorker.on("listening", function() {
          console.log("Replacement worker online.\n");
          i++;
          workersRestartHandler();
        });
      }
      workersRestartHandler();
    });
} else {
  require("./server");
}
