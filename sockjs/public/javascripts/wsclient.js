// Get the host
var host = window.document.location.host.replace(/:.*/, "");

// Open a new secure WebSocket connection (wss) using sockjs client
var sock = new SockJS("https://" + host + ":8000/wss");

// Optional callback, invoked if a connection error has occurred
sock.onerror = function (error) {
    console.log(error);
};

// Optional callback, invoked when the connection is terminated
sock.onclose = function () {};

// Optional callback, invoked when a WebSocket connection is established
sock.onopen = function () {
    // Client-initiated message to the server
    sock.send("Connection established. Hello server!");
    document.getElementById("connected").innerHTML = "Connecting";
};

// A callback function invoked for each new message from the server
sock.onmessage = function(msg) {

    // Parse the message
    var data = msg && msg.data && JSON.parse(msg.data);

    if (data.connected) {
        document.getElementById("connected").innerHTML = data.connected;
    }
    else {
        updateStats(data);
    }
};

function updateStats(memuse) {
    document.getElementById("rss").innerHTML = memuse.rss;
    document.getElementById("heapTotal").innerHTML = memuse.heapTotal;
    document.getElementById("heapUsed").innerHTML = memuse.heapUsed;
}