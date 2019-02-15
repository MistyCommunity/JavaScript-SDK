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

function LightSocket(ip, OnOpenCallback = null, OnCloseCallback = null, OnErrorCallback = null) {

	var ipAddress = (ip === null ? "localhost" : ip);
	var eventListeners = new Map();

	this.Subscribe = function (eventName, msgType, debounceMs, property, inequality, value, returnProperty, eventCallback) {
		eventName = eventName ? eventName : msgType;
		console.log("Subscribing to " + msgType + " as " + eventName);

		var msg = {
			"$id": "1",
			"Operation": "subscribe",
			"Type": msgType,
			"DebounceMs": debounceMs,
			"EventName": eventName,
			"Message": "",
			"ReturnProperty": returnProperty
		};

		if (property) {
			msg.EventConditions = [
				{
					"Property": property,
					"Inequality": inequality ? inequality : "exists",
					"Value": value ? value : "0"
				}
			];
		}
		var message = JSON.stringify(msg);
		websocket.send(message);
		eventListeners.set(eventName, eventCallback);
	};

	this.Unsubscribe = function (eventName) {
		var msg = {
			"$id": "1",
			"Operation": "unsubscribe",
			"EventName": eventName,
			"Message": ""
		};
		var message = JSON.stringify(msg);
		websocket.send(message);
		eventListeners.delete(eventName);
		console.log("Unsubscribing from " + eventName);
	};

	this.Disconnect = function () {
		websocket.close();
	};

	this.Connect = function () {
		var me = this;
		websocket = new WebSocket("ws://" + ipAddress + "/pubsub");

		websocket.onopen = function (event) {
			console.log("Opened socket");
			if (OnOpenCallback) {
				OnOpenCallback(event.data);
			}
		};

		websocket.onmessage = function (event) {
			try {
				// Parse the JSON if possible.
				var theDataObject = JSON.parse(event.data);
				var messageId = theDataObject.eventName ? theDataObject.eventName : theDataObject.type;

				//Call the callback, otherwise it is probably a status
				if (eventListeners.has(messageId)) {
					eventListeners.get(messageId)(theDataObject);
				}
			}
			catch (e) {
				//TODO this is not necessarily an error just because it is not valid JSON.
				console.log("Invalid JSON or failure obtaining callback", event.data);
			}
		};

		websocket.onclose = function (event) {
			console.log("Closed socket");
			if (OnCloseCallback) {
				OnCloseCallback(event.data);
			}
		};

		websocket.onerror = function (event) {
			if (OnErrorCallback) {
				var theData = {
					timeStamp: event.timeStamp,
					type: event.type,
					url: event.target.url
				};

				OnErrorCallback(theData);
			}
		};

		window.onbeforeunload = function (event) {
			websocket.close();
		};

		return websocket;
	};

	this.Disconnect = function () {
		console.log("Disconnected from socket");
		websocket.close();
	};
}
