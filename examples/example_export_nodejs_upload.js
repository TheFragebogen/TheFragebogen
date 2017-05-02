/**
@file example_export_nodejs_upload.js
@author Dennis Guse
@date 2016-10-18
@license MIT

A small http server for demo purposes: starts at port 8088 and waits for http requests.

Start with:

```bash
nodejs example_export_nodejs_upload.js
```

*/

var http = require('http');

//We need a function which handles requests and send response
function handleRequest(request, response) {
    console.log("Got message:");

    response.setHeader('Access-Control-Allow-Origin', '*');

    var body = [];
    request.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        console.log(body);
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        response.end("");
        console.log("===============================================\n");
    });
}

var server = http.createServer(handleRequest);
server.listen(8088, function() {
    console.log("Server listening");
    console.log("===============================================");
});
