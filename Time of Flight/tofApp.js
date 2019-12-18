/*
*    Copyright 2018 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

var ip;
var subscribeMsg = {
  "Operation": "subscribe",
  "Type": "TimeOfFlight",
  "DebounceMs": 100,
	"EventName": "FrontCenterTimeOfFlight",
  "Message": "",
  "ReturnProperty": null,
  "EventConditions":
  {
    "Property": "SensorId",
    "Inequality": "=",
    "Value": "toffc"
  }
};

var unsubscribeMsg = {
  "Operation": "unsubscribe",
  "EventName": "FrontCenterTimeOfFlight",
  "Message": ""
};

var subMsg = JSON.stringify(subscribeMsg);
var unsubMsg = JSON.stringify(unsubscribeMsg);
var messageCount = 0;
var socket;

function startTimeOfFlight() {
    //Create a new websocket
    socket = new WebSocket("ws://" + ip + "/pubsub");
    //When the socket is open, subscribe to the event
    socket.onopen = function(event) {
      console.log("WebSocket opened.");
      socket.send(subMsg);
    };
    // Handle messages received from the server
    socket.onmessage = function(event) {
      var message = JSON.parse(event.data).message;
      messageCount += 1;
      console.log(message);
      if (messageCount == 10) {
	socket.send(unsubMsg);
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
