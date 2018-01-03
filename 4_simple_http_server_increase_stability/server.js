// server.js
const http = require('http');
const pid = process.pid;

let usersCount;

http.createServer((req, res) => {
  for (let i=0; i<1e7; i++); // simulate CPU work
  res.write(`Handled by process ${pid}\n`);
}).listen(8080, () => {
  console.log(`\nStarted process ${pid}`);
});

// To simulate a random crash in the server process, we can
// simply do a process.exit call inside a timer that fires
// after a random amount of time:
const timeout = Math.random() * 10000;
console.log('timeout = ', timeout)
setTimeout(() => {
  process.exit(1) // death by random timeout
}, timeout);
