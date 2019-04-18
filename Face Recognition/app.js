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

var connect = document.getElementById("connect");
var ipAddress = document.getElementById("ip-address");
var resultsBox = document.getElementById("results");
var start = document.getElementById("start");
var stop = document.getElementById("stop");

var client;
var ip;
var msg = {
  "$id": "1",
  "Operation": "subscribe",
  "Type": "FaceRecognition",
  "DebounceMs": 100,
	"EventName": "FaceRecognition",
  "Message": ""
};
var message = JSON.stringify(msg);
var messageCount = 0;
var socket;

connect.onclick = function() {
  ip = validateIPAddress(ipAddress.value);
  if (!ip) {
    printToScreen("IP address needed.");
    return;
  }
  client = new LightClient(ip, 10000);
  client.GetCommand("device", function(data) {
    printToScreen("Connected to robot.");
    console.log(data);
  });
};

start.onclick = function() {
  if (!ip) {
    printToScreen("You must connect to a robot first.");
  }
  startFaceRecognition();
};

stop.onclick = function() {
  client.PostCommand("faces/recognition/stop");
  printToScreen("Face recognition stopped.");
  socket.close();
};

function startFaceRecognition() {
    //Create a new websocket
    socket = new WebSocket("ws://" + ip + "/pubsub");
    //When the socket is open, send the message
    socket.onopen = function(event) {
      printToScreen("WebSocket opened.");
      socket.send(message);
      client.PostCommand("faces/recognition/start", null, handleResult);
    };
    // Handle messages received from the server
    socket.onmessage = function(event) {
      console.log(event);
      var message = JSON.parse(event.data).message;
      console.log(message);
      if (message.personName && message.personName !== "unknown person") {
        printToScreen("I think I know you. Is this " + message.personName + "?");
      } else {
        messageCount += 1;
      }
      if (messageCount % 10 === 0) {
        printToScreen("Looking for a familiar face ...");
      }
    };
    // Handle any errors that occur.
    socket.onerror = function(error) {
      console.log("WebSocket Error: " + error);
    };
    // Do something when the WebSocket is closed.
    socket.onclose = function(event) {
      printToScreen("WebSocket closed.");
    };
};

function handleResult(data) {
  console.log(data);
  if (data.result) {
    printToScreen("Face recognition started.")
  }
}

function validateIPAddress(ip) {
	var ipNumbers = ip.split(".");
	var ipNums = new Array(4);
	if (ipNumbers.length !== 4) {
		return "";
	}
	for (let i = 0; i < 4; i++) {
		ipNums[i] = parseInt(ipNumbers[i]);
		if (ipNums[i] < 0 || ipNums[i] > 255) {
			return "";
		}
	}
	return ip;
};

function printToScreen(msg) {
  resultsBox.innerHTML += (msg + "\r\n");
}
