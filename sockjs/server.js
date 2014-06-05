var https = require("https");
var fs = require("fs");
var app = require("./express");
var sockjs = require("sockjs");

var options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./key-cert.pem")
};

var server = https.createServer(options, app).listen(app.get("port"), function(){
    console.log("Express Server listening on port", server.address().port);
});

// Initialize a sockjs server
var sjss = sockjs.createServer();

// Listen for 'connection' events and handle
sjss.on("connection", function(conn) {

    // Listen for 'data' events from the client and handle
    conn.on("data", function(data) {
        console.log("received: %s", data);
    });

    // Send data to the client
    conn.write(JSON.stringify({ connected: true }));

    var interval = setInterval(function() {
        conn.write(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
    }, 100);
    console.log("started client interval");

    conn.on("close", function() {
        console.log("stopping client interval");
        clearInterval(interval);
    });
});

// Register the sockjs server on the HTTP server and start listening
sjss.installHandlers(server, { prefix: "/wss" });