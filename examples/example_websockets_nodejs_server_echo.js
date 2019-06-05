/**
@file example_websockets_nodejs_server_echo.js
@author Dennis Guse
@date 2016-10-18
@license MIT

A small websocket server for demo purposes of `QuestionnaireItemWaitWebsocket`.
Starts at port 8080 and on client-connect waits for incoming message and echos these.

Uses [ws](https://www.npmjs.com/package/ws):

```bash
npm install ws
```

Start with:

```bash
node example_websockets_nodejs_server_echo.js
```

*/

var wss = new(require('ws')).Server({
    port: 8080
});
console.log("example_websockets_nodejs_server_echo.js");
console.log("Server listening on port " + wss.options.port);
console.log("===============================================");

wss.on('connection', function(ws, req) {
    ws.origin = req.headers['sec-websocket-key'];

    console.log("The client " + ws.origin + " has just connected. ");

    ws.on('message', function(msg) {
        console.log("The client '" + ws.origin + "' sent the message '" + msg + "'");
        setTimeout(function() {
            ws.send(msg);
        }.bind(this), 2500);
    }.bind(this));

    ws.on('close', function() {
        console.log("The client " + ws.origin + " has just disconnected. ");
    }.bind(this));
});
