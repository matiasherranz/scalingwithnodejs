// cluster.js
const cluster = require('cluster');
const os = require('os');

// **** Mock DB Call
const numberOfUsersInDB = function() {
  this.count = this.count || 5;
  this.count = this.count * this.count;
  return this.count;
}
// ****

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i<cpus; i++) {
    cluster.fork();
  }

  // use the same loop to broadcast the users count value to all workers:
  const updateWorkers = () => {
    const usersCount = numberOfUsersInDB();
    Object.values(cluster.workers).forEach(worker => {
        worker.send({ usersCount });
      });
  };

  updateWorkers();
  setInterval(updateWorkers, 10000);

} else {
  require('./server');
}

// To simulate a random crash in the server process, we can
// simply do a process.exit call inside a timer that fires
// after a random amount of time:
setTimeout(() => {
  process.exit(1) // death by random timeout
}, Math.random() * 10000
