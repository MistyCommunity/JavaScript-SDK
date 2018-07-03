var ip;
var msg = {
  "Operation": "subscribe",
  "Type": "TimeOfFlight",
  "DebounceMs": 100,
	"EventName": "CenterTimeOfFlight",
  "Message": "",
  "ReturnProperty": null,
  "EventConditions":
  {
    "Property": "SensorPosition",
    "Inequality": "=",
    "Value": "Center"
  }
};

var message = JSON.stringify(msg);
var messageCount = 0;
var socket;
function startTimeOfFlight() {
    //Create a new websocket
    socket = new WebSocket("ws://" + ip + "/pubsub");
    //When the socket is open, subscribe to the event
    socket.onopen = function(event) {
      console.log("WebSocket opened.");
      socket.send(message);
    };
    // Handle messages received from the server
    socket.onmessage = function(event) {
      var message = JSON.parse(event.data).message;
      messageCount += 1;
      console.log(message);
      if (messageCount == 10) {
        socket.close();
      }
    };
    // Handle any errors that occur.
    socket.onerror = function(error) {
      console.log("WebSocket Error: " + error);
    };
    // Do something when the WebSocket is closed.
    socket.onclose = function(event) {
      console.log("WebSocket closed.");
    };
};
