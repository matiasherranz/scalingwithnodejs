// cluster.js
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i<cpus; i++) {
    cluster.fork();
  }

  // Let's send messages to workers
  // Note: Object.values is a new feature in ES2017.
  // It is very bleeding edge. Node.js has full support for it
  // from version 7.0. Make sure of using the right NodeJS version.
  Object.values(cluster.workers).forEach(worker => {
    worker.send(`Hello Worker ${worker.id}`);
  });
  
} else {
  require('./server');
}