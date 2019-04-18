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

var cancel = document.getElementById("cancel");
var connect = document.getElementById("connect");
var faceName = document.getElementById("face-name");
var form = document.getElementById("form");
var ipAddress = document.getElementById("ip-address");
var resultsBox = document.getElementById("results");
var start = document.getElementById("start");

var client;
var ip;
var msg = {
  "$id": "1",
  "Operation": "subscribe",
  "Type": "FaceTraining",
  "DebounceMs": 100,
	"EventName": "FaceTraining",
  "Message": ""
};
var message = JSON.stringify(msg);
var messageCount = 0;
var socket;

cancel.onclick = function() {
  client.PostCommand("faces/training/cancel");
  printToScreen("Face training canceled.");
}

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
  if (!faceName.value) {
    printToScreen("You must enter a name to begin face training.");
    return;
  }
  var name = faceName.value;
  var payload = {
    "FaceId": name
  }
  client.PostCommand("faces/training/start", JSON.stringify(payload), handleData);
}

function handleData (data) {
  if (data.result) {
    printToScreen("Face training started. Hold face in front of camera for 10 seconds.");
  }
  console.log(data);
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
