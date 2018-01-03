// server.js
const http = require('http');
const pid = process.pid;

let usersCount;

http.createServer((req, res) => {
  for (let i=0; i<1e7; i++); // simulate CPU work
  res.write(`Handled by process ${pid}\n`);
  res.end(`Users: ${usersCount}`);
}).listen(8080, () => {
  console.log(`Started process ${pid}`);
});

/* In a worker file, to read a message received from the
 * master process, we can register a handler for the message
 * event on the global process object.
 * For example:
 */
process.on('message', msg => {
  console.log(`usersCount from master: ${msg.usersCount}`);
});
