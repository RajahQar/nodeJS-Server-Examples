// ------------------------------------
// Server Example: Capitalizing Service
// Flaws: This example does not provide back-flow, so if the rate at which the
// client sends characters is lower than the rate it receives (for example, if
// the downstream available bandwidth is higher than the upstream one), our
// process memory will grow until exhausted. What we need here is a mechanism
// by which the incoming TCP stream is paused if the level of memory pending
// on the outgoing buffer gets high enough.
// Solution: See Capitalizing Service 2 - capitalizingServer2.js
// ------------------------------------
const net = require('net');

const server = net.createServer();
server.on('connection', handleConnection);

server.listen(9000, function() {
  console.log('server listening to %j', server.address());
});

function handleConnection(conn) {
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.setEncoding('utf8');

  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d) {
    console.log('connection data from %s: %j', remoteAddress, d);
    conn.write(d.toUpperCase())
  }

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}
