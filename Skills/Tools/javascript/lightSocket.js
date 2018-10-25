// 		Copyright 2018 Misty Robotics, Inc.
// 		Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// 		to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// 		and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 		The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// 		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// 		WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

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
