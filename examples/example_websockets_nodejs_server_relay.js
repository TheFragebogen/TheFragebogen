/**
@file example_websockets_nodejs_server_relay.js
@author Dennis Guse
@date 2016-10-18
@license MIT

A small websocket server that to show browser to X communication via WebSockets.
Starts at port 8080 and on client-connect waits for incoming message and forwards it to all other clients.

Uses [ws](https://www.npmjs.com/package/ws):

```bash
npm install ws
```

Start with:

```bash
node example_websockets_nodejs_server_relay.js
```

*/

var wss = new(require('ws')).Server({
    port: 8080
});
console.log("example_websockets_nodejs_server_relay.js");
console.log("Server listening on port " + wss.options.port);
console.log("===============================================");

const ws_connections = [];

wss.on('connection', function(ws, req) {
    ws.origin = req.headers['sec-websocket-key'];

    ws_connections.push(ws);

    console.log("The client " + ws.origin + " has just connected. ");

    ws.on('message', function(msg) {
        console.log("Forwarding for client '" + ws.origin + "' the message '" + msg + "'");
        ws_connections.filter(ws_connection => ws_connection !== ws).map((ws) => ws.send(msg));
    }.bind(this));

    ws.on('close', function() {
        ws_connections.splice(ws_connections.indexOf(ws), 1);
        console.log("The client " + ws.origin + " has just disconnected. ");
    }.bind(this));
});
